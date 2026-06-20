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

## Known simplifications (read before trusting this for anything important)

- **Round of 32 bracket pairing is randomized per simulation**, not FIFA's exact
  pre-published slot table. FIFA assigns specific bracket slots to specific
  group-position combinations (e.g. "1st in Group A plays the highest-ranked
  qualifying 3rd-place team from Groups C/D/F..."), which depends on which combination
  of third-place teams actually qualifies. Replicating that exactly requires hard-coding
  FIFA's slot-allocation table. The current version avoids same-group rematches in the
  immediate next round but doesn't reproduce the official slotting. This affects *which*
  team a given side faces in the Round of 32, not the underlying team-strength estimates.
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
