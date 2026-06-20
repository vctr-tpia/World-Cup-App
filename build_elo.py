"""
Build Elo ratings for all international football teams from full match history.
Standard football Elo with goal-difference-based K multiplier (like World Football Elo Ratings).
"""
import csv
from collections import defaultdict
from datetime import datetime

INIT_ELO = 1500
BASE_K = 20  # base K-factor
MIN_DATE = '2018-01-01'

# Tournament importance weighting (mirrors eloratings.net approach, simplified)
def tournament_weight(t):
    t = t.lower()
    if 'world cup' in t and 'qualif' not in t:
        return 1.6   # World Cup finals
    if 'world cup' in t and 'qualif' in t:
        return 1.0   # WC qualifiers
    if 'confederations cup' in t:
        return 1.2
    if any(x in t for x in ['euro', 'copa am', 'african cup of nations', 'asian cup', 'gold cup', 'concacaf']) and 'qualif' not in t:
        return 1.3   # continental championships
    if 'nations league' in t:
        return 1.0
    if 'qualif' in t:
        return 0.9
    if 'friendly' in t:
        return 0.7
    return 0.85  # other minor tournaments

def expected_score(r_home, r_away):
    return 1 / (1 + 10 ** ((r_away - r_home) / 400))

def goal_diff_multiplier(goal_diff):
    # Standard World Football Elo adjustment for margin of victory
    if goal_diff <= 1:
        return 1.0
    elif goal_diff == 2:
        return 1.5
    else:
        return (11 + goal_diff) / 8

def main():
    matches = []
    with open('results.csv') as f:
        r = csv.DictReader(f)
        for row in r:
            if row['date'] < MIN_DATE:
                continue
            if row['home_score'] in ('', 'NA') or row['away_score'] in ('', 'NA'):
                continue
            try:
                hs, aw = int(row['home_score']), int(row['away_score'])
            except ValueError:
                continue
            matches.append({
                'date': row['date'],
                'home': row['home_team'],
                'away': row['away_team'],
                'hs': hs,
                'aw': aw,
                'tournament': row['tournament'],
                'neutral': row['neutral'] == 'TRUE'
            })

    matches.sort(key=lambda m: m['date'])
    print(f"Loaded {len(matches)} completed matches from {matches[0]['date']} to {matches[-1]['date']}")

    elo = defaultdict(lambda: INIT_ELO)
    history = defaultdict(list)  # team -> list of (date, elo) for tracking

    for m in matches:
        home, away = m['home'], m['away']
        r_home, r_away = elo[home], elo[away]

        # home advantage bump (only if not neutral venue)
        home_adv = 0 if m['neutral'] else 65

        exp_home = expected_score(r_home + home_adv, r_away)

        if m['hs'] > m['aw']:
            actual_home = 1.0
        elif m['hs'] < m['aw']:
            actual_home = 0.0
        else:
            actual_home = 0.5

        gd = abs(m['hs'] - m['aw'])
        k = BASE_K * tournament_weight(m['tournament']) * goal_diff_multiplier(gd)

        delta = k * (actual_home - exp_home)
        elo[home] = r_home + delta
        elo[away] = r_away - delta

        history[home].append((m['date'], elo[home]))
        history[away].append((m['date'], elo[away]))

    # Save final ratings
    final_ratings = dict(elo)
    with open('elo_ratings.csv', 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['team', 'elo'])
        for team, rating in sorted(final_ratings.items(), key=lambda x: -x[1]):
            w.writerow([team, round(rating, 1)])

    print(f"\nTop 20 teams by Elo (as of {matches[-1]['date']}):")
    for team, rating in sorted(final_ratings.items(), key=lambda x: -x[1])[:20]:
        print(f"  {team:25s} {rating:.0f}")

    return final_ratings, matches

if __name__ == '__main__':
    main()
