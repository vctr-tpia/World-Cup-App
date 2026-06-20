"""
Predict a single match between two teams.

Combines:
  - Elo ratings -> win/draw/loss probability (via a standard Elo-to-1X2 conversion
    that allocates a draw band around a 50/50 Elo expectation)
  - Poisson attack/defense model -> expected goals for each side, and a full
    scoreline probability matrix (e.g. P(2-1), P(0-0), etc.)

Usage:
    python3 predict_match.py "Argentina" "Brazil"
    python3 predict_match.py "Argentina" "Brazil" --neutral False --home_advantage
    python3 predict_match.py "England" "France" --max_goals 6
"""
import csv
import math
import sys
import argparse

AVG_GOALS = 1.386  # global average goals/team/game, from build_goal_model.py

def load_elo():
    elo = {}
    with open('elo_ratings.csv') as f:
        for row in csv.DictReader(f):
            elo[row['team']] = float(row['elo'])
    return elo

def load_goal_model():
    attack, defense = {}, {}
    with open('goal_model.csv') as f:
        for row in csv.DictReader(f):
            attack[row['team']] = float(row['attack_strength'])
            defense[row['team']] = float(row['defense_strength'])
    return attack, defense

def poisson_pmf(k, lam):
    return math.exp(-lam) * lam**k / math.factorial(k)

def elo_to_1x2(elo_home, elo_away, home_adv=0):
    """
    Convert an Elo difference into win/draw/loss probabilities.
    Base win prob comes from the standard Elo logistic formula. We then carve out
    a draw probability that shrinks as the Elo gap widens (mismatched teams draw
    less often than evenly matched ones) -- this mirrors the empirical pattern in
    the historical results data rather than just doing a coin-flip on draws.
    """
    diff = (elo_home + home_adv) - elo_away
    p_home_no_draw = 1 / (1 + 10 ** (-diff / 400))  # prob home "wins" a draw-less contest

    # Draw probability: highest (~28%) when teams are evenly matched, shrinking
    # toward ~12% as the gap grows. Calibrated loosely against typical international
    # football draw rates.
    draw_base = 0.28
    draw_floor = 0.12
    scale = 600  # Elo points over which draw probability decays
    p_draw = draw_floor + (draw_base - draw_floor) * math.exp(-(diff/scale)**2)

    p_home = p_home_no_draw * (1 - p_draw)
    p_away = (1 - p_home_no_draw) * (1 - p_draw)
    return p_home, p_draw, p_away

def predict(home, away, elo, attack, defense, neutral=True, max_goals=8):
    if home not in elo or away not in elo:
        missing = [t for t in (home, away) if t not in elo]
        raise ValueError(f"Team(s) not found in Elo ratings: {missing}. "
                          f"Check exact spelling (case-sensitive) against elo_ratings.csv.")

    elo_home, elo_away = elo[home], elo[away]
    home_adv_elo = 0 if neutral else 65
    p_home, p_draw, p_away = elo_to_1x2(elo_home, elo_away, home_adv_elo)

    atk_h = attack.get(home, 0.85); def_h = defense.get(home, 1.15)
    atk_a = attack.get(away, 0.85); def_a = defense.get(away, 1.15)
    home_adv_goals = 0 if neutral else 0.08

    lam_home = max(0.15, AVG_GOALS * atk_h * def_a + home_adv_goals)
    lam_away = max(0.15, AVG_GOALS * atk_a * def_h)

    # Full scoreline probability matrix
    score_probs = {}
    for h in range(max_goals + 1):
        for a in range(max_goals + 1):
            score_probs[(h, a)] = poisson_pmf(h, lam_home) * poisson_pmf(a, lam_away)

    most_likely_score = max(score_probs, key=score_probs.get)

    return {
        'home': home, 'away': away,
        'elo_home': elo_home, 'elo_away': elo_away,
        'p_home_win': p_home, 'p_draw': p_draw, 'p_away_win': p_away,
        'expected_goals_home': lam_home, 'expected_goals_away': lam_away,
        'most_likely_score': most_likely_score,
        'most_likely_score_prob': score_probs[most_likely_score],
        'score_probs': score_probs,
    }

def print_report(result, top_n_scores=8):
    h, a = result['home'], result['away']
    print(f"\n{h} vs {a}")
    print(f"  Elo: {h} {result['elo_home']:.0f}  |  {a} {result['elo_away']:.0f}\n")

    print("Match outcome probabilities:")
    print(f"  {h+' win':25s} {result['p_home_win']*100:5.1f}%")
    print(f"  {'Draw':25s} {result['p_draw']*100:5.1f}%")
    print(f"  {a+' win':25s} {result['p_away_win']*100:5.1f}%")

    print(f"\nExpected goals: {h} {result['expected_goals_home']:.2f}  -  "
          f"{result['expected_goals_away']:.2f} {a}")

    mh, ma = result['most_likely_score']
    print(f"Most likely exact scoreline: {h} {mh}-{ma} {a} "
          f"({result['most_likely_score_prob']*100:.1f}% chance)")

    print(f"\nTop {top_n_scores} most likely scorelines:")
    ranked = sorted(result['score_probs'].items(), key=lambda x: -x[1])[:top_n_scores]
    for (hg, ag), p in ranked:
        print(f"  {h} {hg}-{ag} {a}   {p*100:5.1f}%")

    # Common derived markets
    over_2_5 = sum(p for (hg, ag), p in result['score_probs'].items() if hg + ag > 2.5)
    btts = sum(p for (hg, ag), p in result['score_probs'].items() if hg > 0 and ag > 0)
    print(f"\nOver 2.5 total goals: {over_2_5*100:.1f}%")
    print(f"Both teams to score: {btts*100:.1f}%")

def main():
    parser = argparse.ArgumentParser(description="Predict a single international football match.")
    parser.add_argument('home', help="Home team name (must match results.csv spelling)")
    parser.add_argument('away', help="Away team name (must match results.csv spelling)")
    parser.add_argument('--neutral', type=lambda x: x.lower() != 'false', default=True,
                         help="Is this a neutral-venue match? (default True, e.g. World Cup group games)")
    parser.add_argument('--max_goals', type=int, default=8, help="Max goals to model per side")
    args = parser.parse_args()

    elo = load_elo()
    attack, defense = load_goal_model()
    result = predict(args.home, args.away, elo, attack, defense,
                      neutral=args.neutral, max_goals=args.max_goals)
    print_report(result)

if __name__ == '__main__':
    main()
