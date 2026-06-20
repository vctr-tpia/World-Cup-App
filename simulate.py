"""
2026 World Cup Monte Carlo simulator.
1. Load Elo ratings + Poisson attack/defense strengths (built from results.csv history)
2. Load actual 2026 WC fixtures from results.csv (some already played, some NA)
3. For each simulation:
   - Use real results for played games
   - Simulate remaining group games via Poisson scorelines
   - Rank groups (pts, GD, GS) + pick 2 per group + 8 best 3rd place = 32 teams
   - Simulate Round of 32 -> R16 -> QF -> SF -> Final via Elo win-prob (knockouts: no draws)
4. Aggregate probabilities of reaching each stage / winning it all
"""
import csv
import random
import math
from collections import defaultdict, Counter

random.seed(42)
N_SIMS = 10000

# ---------- Load Elo ----------
elo = {}
with open('elo_ratings.csv') as f:
    r = csv.DictReader(f)
    for row in r:
        elo[row['team']] = float(row['elo'])

# ---------- Load goal model ----------
attack = {}
defense = {}
with open('goal_model.csv') as f:
    r = csv.DictReader(f)
    for row in r:
        attack[row['team']] = float(row['attack_strength'])
        defense[row['team']] = float(row['defense_strength'])

AVG_GOALS = 1.386

def get_attack(t):
    return attack.get(t, 0.85)

def get_defense(t):
    return defense.get(t, 1.15)

def get_elo(t):
    return elo.get(t, 1500)

# ---------- Load 2026 WC fixtures from dataset ----------
group_fixtures = []
with open('results.csv') as f:
    r = csv.DictReader(f)
    for row in r:
        if row['tournament'] == 'FIFA World Cup' and row['date'] >= '2026-06-01':
            hs = row['home_score']
            aw = row['away_score']
            hs = int(hs) if hs not in ('', 'NA') else None
            aw = int(aw) if aw not in ('', 'NA') else None
            group_fixtures.append({'home': row['home_team'], 'away': row['away_team'],
                                    'hs': hs, 'aw': aw, 'neutral': row['neutral'] == 'TRUE'})

print(f"Loaded {len(group_fixtures)} group-stage fixtures "
      f"({sum(1 for m in group_fixtures if m['hs'] is not None)} played, "
      f"{sum(1 for m in group_fixtures if m['hs'] is None)} remaining)")

# ---------- Infer groups ----------
teams = set()
edges = defaultdict(set)
for m in group_fixtures:
    teams.add(m['home']); teams.add(m['away'])
    edges[m['home']].add(m['away'])
    edges[m['away']].add(m['home'])

parent = {t: t for t in teams}
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
def union(x, y):
    px, py = find(x), find(y)
    if px != py: parent[px] = py
for h, opps in edges.items():
    for o in opps: union(h, o)
group_map = defaultdict(list)
for t in teams: group_map[find(t)].append(t)
groups = list(group_map.values())

print(f"Inferred {len(groups)} groups of {[len(g) for g in groups]} teams\n")

def poisson_sample(lam):
    L = math.exp(-lam)
    k = 0
    p = 1.0
    while True:
        k += 1
        p *= random.random()
        if p <= L:
            return k - 1

def simulate_score(home, away, neutral=True):
    home_adv = 0 if neutral else 0.08
    lam_home = max(0.15, AVG_GOALS * get_attack(home) * get_defense(away) + home_adv)
    lam_away = max(0.15, AVG_GOALS * get_attack(away) * get_defense(home))
    return poisson_sample(lam_home), poisson_sample(lam_away)

def knockout_win_prob(team_a, team_b):
    ra, rb = get_elo(team_a), get_elo(team_b)
    return 1 / (1 + 10 ** ((rb - ra) / 400))

def play_knockout(team_a, team_b):
    p = knockout_win_prob(team_a, team_b)
    return team_a if random.random() < p else team_b

def rank_group(table):
    return sorted(table.keys(), key=lambda t: (-table[t]['pts'], -table[t]['gd'], -table[t]['gf']))

# ---------- Run simulations ----------
champion_counts = Counter()
final_counts = Counter()
sf_counts = Counter()
qf_counts = Counter()
r16_counts = Counter()
r32_counts = Counter()
group_winner_counts = Counter()

group_of = {}
for gi, g in enumerate(groups):
    for t in g:
        group_of[t] = gi

for sim in range(N_SIMS):
    group_tables = [{t: {'pts':0,'gf':0,'ga':0,'gd':0} for t in g} for g in groups]

    for m in group_fixtures:
        h, a = m['home'], m['away']
        gi = group_of[h]
        table = group_tables[gi]
        if m['hs'] is not None:
            hs, aw = m['hs'], m['aw']
        else:
            hs, aw = simulate_score(h, a, neutral=m['neutral'])
        table[h]['gf'] += hs; table[h]['ga'] += aw
        table[a]['gf'] += aw; table[a]['ga'] += hs
        if hs > aw:
            table[h]['pts'] += 3
        elif hs < aw:
            table[a]['pts'] += 3
        else:
            table[h]['pts'] += 1; table[a]['pts'] += 1

    for table in group_tables:
        for t in table:
            table[t]['gd'] = table[t]['gf'] - table[t]['ga']

    group_rankings = [rank_group(t) for t in group_tables]
    winners = [r[0] for r in group_rankings]
    runners = [r[1] for r in group_rankings]
    thirds = [(r[2], group_tables[gi][r[2]]) for gi, r in enumerate(group_rankings)]

    for w in winners:
        group_winner_counts[w] += 1

    thirds_sorted = sorted(thirds, key=lambda x: (-x[1]['pts'], -x[1]['gd'], -x[1]['gf']))
    best_thirds = [t[0] for t in thirds_sorted[:8]]

    qualified = winners + runners + best_thirds
    for t in qualified:
        r32_counts[t] += 1

    field = winners + runners
    random.shuffle(field)
    thirds_shuffled = best_thirds[:]
    random.shuffle(thirds_shuffled)

    wr = field[:]
    third_idx = 0
    pairs = []
    while len(wr) >= 2:
        a = wr.pop()
        if third_idx < len(thirds_shuffled) and random.random() < 0.5:
            b = thirds_shuffled[third_idx]
            third_idx += 1
        else:
            b = wr.pop()
        pairs.append((a, b))
    while third_idx < len(thirds_shuffled):
        if wr:
            pairs.append((wr.pop(), thirds_shuffled[third_idx]))
        elif third_idx + 1 < len(thirds_shuffled):
            pairs.append((thirds_shuffled[third_idx], thirds_shuffled[third_idx+1]))
            third_idx += 1
        third_idx += 1

    r16 = [play_knockout(a, b) for a, b in pairs]
    for t in r16: r16_counts[t] += 1

    random.shuffle(r16)
    qf = []
    for i in range(0, len(r16) - 1, 2):
        qf.append(play_knockout(r16[i], r16[i+1]))
    for t in qf: qf_counts[t] += 1

    random.shuffle(qf)
    sf = []
    for i in range(0, len(qf) - 1, 2):
        sf.append(play_knockout(qf[i], qf[i+1]))
    for t in sf: sf_counts[t] += 1

    random.shuffle(sf)
    final = []
    for i in range(0, len(sf) - 1, 2):
        final.append(play_knockout(sf[i], sf[i+1]))
    for t in final: final_counts[t] += 1

    if len(final) == 2:
        champ = play_knockout(final[0], final[1])
        champion_counts[champ] += 1

# ---------- Report ----------
print(f"\n=== Results from {N_SIMS} simulations ===\n")
print(f"{'Team':25s} {'GroupWin%':>10s} {'R32%':>7s} {'R16%':>7s} {'QF%':>7s} {'SF%':>7s} {'Final%':>8s} {'Champ%':>8s}")
for t in sorted(teams, key=lambda t: -(champion_counts[t]*1000 + final_counts[t]*100 + sf_counts[t]*10 + qf_counts[t])):
    print(f"{t:25s} {group_winner_counts[t]/N_SIMS*100:9.1f}% {r32_counts[t]/N_SIMS*100:6.1f}% "
          f"{r16_counts[t]/N_SIMS*100:6.1f}% {qf_counts[t]/N_SIMS*100:6.1f}% {sf_counts[t]/N_SIMS*100:6.1f}% "
          f"{final_counts[t]/N_SIMS*100:7.1f}% {champion_counts[t]/N_SIMS*100:7.2f}%")

with open('simulation_results.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['team', 'group_win_pct', 'reach_r32_pct', 'reach_r16_pct', 'reach_qf_pct',
                'reach_sf_pct', 'reach_final_pct', 'win_champion_pct'])
    for t in teams:
        w.writerow([t, round(group_winner_counts[t]/N_SIMS*100,2), round(r32_counts[t]/N_SIMS*100,2),
                    round(r16_counts[t]/N_SIMS*100,2), round(qf_counts[t]/N_SIMS*100,2),
                    round(sf_counts[t]/N_SIMS*100,2), round(final_counts[t]/N_SIMS*100,2),
                    round(champion_counts[t]/N_SIMS*100,2)])

print("\nSaved full results to simulation_results.csv")
