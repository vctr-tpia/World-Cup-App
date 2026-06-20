# World Cup 2026 predictive model

Built on top of martj42/international_results (49k+ international matches, 1872–2026,
including the actual 2026 World Cup fixture list).

## Pipeline

1. `build_elo.py` — builds a running Elo rating for every national team using matches
   from `2018-01-01` onward. Weighted by tournament importance (World Cup > continental
   championships > qualifiers > friendlies) and by margin of victory. Output:
   `elo_ratings.csv`.

2. `build_goal_model.py` — builds a Poisson attack/defense strength model per team,
   using matches from `2018-01-01` onward with recency decay (2-year half-life) and the
   same tournament-importance weighting. This lets us simulate actual scorelines rather
   than just win/draw/loss. Output: `goal_model.csv`.

3. `predict_match.py` — predicts a single match between any two teams in the dataset.
   Run as `python3 predict_match.py "Argentina" "France"` (use `--neutral False` for
   true home matches, `--max_goals N` to widen the scoreline grid). Outputs:
   - Win / draw / loss probabilities (Elo-based, with a draw-probability band that
     shrinks as the Elo gap widens, calibrated to typical international draw rates)
   - Expected goals for each side (Poisson lambda from the attack/defense model)
   - Full scoreline probability matrix (e.g. P(Argentina 2, France 1))
   - Most likely exact scoreline
   - Derived markets: over/under 2.5 goals, both-teams-to-score

4. `simulate.py` — the tournament-level simulator:
   - Loads the actual 2026 World Cup fixtures straight from `results.csv` (group stage
     games already played keep their real scores; unplayed games get simulated)
   - Infers the 12 groups of 4 directly from fixture adjacency (no manual group typing)
   - Runs group stage 10,000 times (Poisson-simulated scorelines for unplayed games)
   - Ranks each group by points → goal difference → goals scored
   - Takes the top 2 from each group + the 8 best third-place teams = 32 team knockout field
   - Simulates Round of 32 through the Final using Elo-based win probability (no draws —
     knockout games resolve via extra time/penalties, modeled as a coin-flip weighted by Elo)
   - Outputs `simulation_results.csv`: probability of each team reaching every stage,
     including outright title probability

## How to run

```bash
pip install --break-system-packages  # no external deps actually needed, pure Python
python3 build_elo.py
python3 build_goal_model.py
python3 simulate.py
```

Each script writes its CSV output, and `simulate.py` prints a full probability table
to the console as well as saving `simulation_results.csv`.

## Web app

This folder now also includes a Vite/React app wrapper for `WorldCupApp.jsx`, so you can
run and deploy the simulator as a normal website. The app currently uses the checked-in
derived model outputs and embedded 2026 fixture/state data from `WorldCupApp.jsx`; it does
not rebuild itself from the upstream `martj42/international_results` repository at runtime.

### Local run

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Share online

Push this folder to GitHub, then import the repo into a static host like Vercel or Netlify.
Both will detect the Vite app automatically and build it with the default commands:

- Install: `npm install`
- Build: `npm run build`
- Output directory: `dist`

### Shared saves with Supabase

By default, score edits save in the browser only. If you want everyone opening the hosted
site to see the same edited results, add Supabase and the app will switch to shared online
storage automatically whenever these Vite env vars are present:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Create this table in Supabase:

```sql
create table public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

create policy "Public can read app state"
on public.app_state
for select
to anon
using (true);

create policy "Public can insert app state"
on public.app_state
for insert
to anon
with check (true);

create policy "Public can update app state"
on public.app_state
for update
to anon
using (true)
with check (true);

create policy "Public can delete app state"
on public.app_state
for delete
to anon
using (true);

grant select, insert, update, delete on public.app_state to anon;
```

Once the two env vars are set in Vercel and the site is redeployed, the `Results` tab will
read and write shared state from Supabase instead of local browser storage.

## Known simplifications (read before trusting this for anything important)

- **The app now uses FIFA's fixed Round of 32 slot table**, including the official
  third-place-team combination mapping. That means the knockout bracket should match the
  published tournament regulations. If FIFA changes that structure before 2026, the app
  would need to be updated manually.
- **Group tiebreakers are simplified** (points → goal difference → goals scored). The
  real rules also include head-to-head results and fair play (cards), omitted here for
  speed at 10,000 iterations.
- **Knockout draws are resolved purely on Elo**, with no separate modeling of fatigue,
  squad depth, injuries, or extra-time/penalty-specific skill (some teams are genuinely
  better at penalties than raw quality would suggest).
- **Home advantage** is only applied to the host nations (Mexico, Canada, US) implicitly
  through the `neutral` column in the dataset; most group games are at neutral-ish mega-
  tournament venues so this matters less than in domestic leagues.
- This was not backtested against prior World Cups (2014/2018/2022) before being pointed
  at 2026. Backtesting is the natural next step if you want to trust the probabilities
  rather than just the team ordering.

## Natural extensions

- Backtest: rerun the same pipeline with data cut off before 2022, and check whether it
  would have predicted that tournament's actual bracket reasonably well.
- Hard-code FIFA's actual Round of 32 slot table for exact bracket fidelity.
- Add player-level injury/availability adjustments close to kickoff.
- Swap the Elo K-factor and Poisson recency half-life for values tuned via backtest
  rather than hand-picked.
