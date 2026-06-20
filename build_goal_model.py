"""
Poisson goal-expectancy model: each team gets an attack strength and defense weakness,
calibrated relative to the international average, with recency weighting and
tournament-importance weighting. This lets us simulate actual scorelines (and thus
group standings via goal difference, not just win/draw/loss).
"""
import csv
import math
from collections import defaultdict
from datetime import datetime

MIN_DATE = '2018-01-01'

def days_between(d1, d2):
    return (datetime.strptime(d2, '%Y-%m-%d') - datetime.strptime(d1, '%Y-%m-%d')).days

def tournament_weight(t):
    t = t.lower()
    if 'world cup' in t and 'qualif' not in t:
        return 1.6
    if 'world cup' in t and 'qualif' in t:
        return 1.0
    if 'confederations cup' in t:
        return 1.2
    if any(x in t for x in ['euro', 'copa am', 'african cup of nations', 'asian cup', 'gold cup', 'concacaf']) and 'qualif' not in t:
        return 1.3
    if 'nations league' in t:
        return 1.0
    if 'qualif' in t:
        return 0.9
    if 'friendly' in t:
        return 0.6
    return 0.8

def recency_weight(match_date, ref_date, half_life_days=730):
    d = days_between(match_date, ref_date)
    if d < 0:
        d = 0
    return 0.5 ** (d / half_life_days)

def main(ref_date='2026-06-18', lookback_years=8):
    matches = []
    with open('results.csv') as f:
        r = csv.DictReader(f)
        for row in r:
            if row['date'] < MIN_DATE:
                continue
            if row['home_score'] in ('', 'NA') or row['away_score'] in ('', 'NA'):
                continue
            if row['date'] > ref_date:
                continue
            try:
                hs, aw = int(row['home_score']), int(row['away_score'])
            except ValueError:
                continue
            matches.append({
                'date': row['date'], 'home': row['home_team'], 'away': row['away_team'],
                'hs': hs, 'aw': aw, 'tournament': row['tournament'],
                'neutral': row['neutral'] == 'TRUE'
            })

    print(f"Using {len(matches)} matches since {MIN_DATE} for goal model")

    total_w = 0
    total_goals_w = 0
    team_attack_w = defaultdict(float)
    team_attack_games = defaultdict(float)
    team_def_w = defaultdict(float)
    team_def_games = defaultdict(float)

    for m in matches:
        w = tournament_weight(m['tournament']) * recency_weight(m['date'], ref_date)
        total_w += 2 * w
        total_goals_w += (m['hs'] + m['aw']) * w

        team_attack_w[m['home']] += m['hs'] * w
        team_attack_games[m['home']] += w
        team_attack_w[m['away']] += m['aw'] * w
        team_attack_games[m['away']] += w

        team_def_w[m['home']] += m['aw'] * w
        team_def_games[m['home']] += w
        team_def_w[m['away']] += m['hs'] * w
        team_def_games[m['away']] += w

    avg_goals = total_goals_w / total_w

    attack_strength = {}
    defense_strength = {}
    for team in team_attack_games:
        if team_attack_games[team] < 5:
            attack_strength[team] = 0.85
            defense_strength[team] = 1.15
            continue
        team_avg_scored = team_attack_w[team] / team_attack_games[team]
        team_avg_conceded = team_def_w[team] / team_def_games[team]
        attack_strength[team] = team_avg_scored / avg_goals
        defense_strength[team] = team_avg_conceded / avg_goals

    with open('goal_model.csv', 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['team', 'attack_strength', 'defense_strength', 'weighted_games'])
        for team in sorted(attack_strength, key=lambda t: -attack_strength[t]/defense_strength[t]):
            w.writerow([team, round(attack_strength[team],3), round(defense_strength[team],3),
                        round(team_attack_games[team],1)])

    print(f"\nGlobal average goals/team/game: {avg_goals:.3f}")
    print("\nTop 15 teams by attack/defense ratio:")
    ranked = sorted(attack_strength, key=lambda t: -attack_strength[t]/defense_strength[t])
    for team in ranked[:15]:
        print(f"  {team:25s} atk={attack_strength[team]:.2f}  def={defense_strength[team]:.2f}  (games={team_attack_games[team]:.0f})")

    return attack_strength, defense_strength, avg_goals

if __name__ == '__main__':
    main()
