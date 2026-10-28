# 🚀 OUTPOST — Junior Astronaut Mission Trainer

**NASA International Space Apps Challenge 2026 · Bangladesh Local Event**
**Challenge 03 — Build a Junior Astronaut Mission Trainer** _(Education & gamification · Intermediate · Youth)_

OUTPOST is an offline-first, gamified astronaut trainer that teaches young people space
engineering **by doing, not by telling**. Players fly a docking approach under a fuel
budget, pass a timed pre-launch checklist, identify real features in NASA EPIC Earth
imagery, and then manage a full lunar/Martian outpost — oxygen, water, food, power,
dust storms and all.

🔗 **Live demo:** [https://outpost-nasa-app-challenge.vercel.app/]
🎬 **240-second judging video:** [VIDEO LINK]
🎬 **30-second global video:** [VIDEO LINK]

---

## The three training missions

1. **Pre-launch checklist** — ordered steps under a 30-second timer; wrong order fails
   the sequence.
2. **Docking** — a physics-based canvas game with real drift, a fuel budget and a
   contact-speed limit: arrive too fast and you crash. Keyboard (arrows/WASD) **and**
   touch D-pad, so a judge can play it on a phone in fifteen seconds.
3. **Earth observation** — a full-disc Earth image from NASA EPIC with a quiz whose
   correct answers are **computed from the image metadata** (centroid latitude/longitude,
   capture date, official caption), plus cited facts from a written question bank.

After the missions: a **Base Builder** (cargo-budget trade-offs), a **Mission Control**
simulation (deterministic daily resource math, random emergencies), a **Results debrief**
with scoring, and a **Science Library** of 11 articles — every one carrying a visible
NASA source link.

## NASA data used

| Dataset                                                        | Used for                             | How                                                                 | Source                              |
| :------------------------------------------------------------- | :----------------------------------- | :------------------------------------------------------------------ | :---------------------------------- |
| **NASA EPIC (DSCOVR)**                                         | Mission 3 imagery + metadata grading | Committed fixtures in `public/fixtures/` (live API attempted first) | https://epic.gsfc.nasa.gov/         |
| **NASA APOD**                                                  | End-of-mission reward image          | Live → cache → graceful skip                                        | https://api.nasa.gov/planetary/apod |
| **NASA mission pages** (InSight, Perseverance/MOXIE, HRP, ISS) | Science Library facts + quiz bank    | Cited per article and per question                                  | see each article's Source link      |
| **NASA NTRS**                                                  | Factual claims reference             | Citations in `public/fixtures/questions.json`                       | https://ntrs.nasa.gov/              |

Every NASA image is credited in-app on the **Credits** page with its source URL.

## Offline behaviour & provenance (the demo cannot fail)

- Static **PWA** with a service worker; all fixtures committed to the repository.
- Every fetch follows **live → cache → committed fixture**, and the interface shows a
  **LIVE / CACHE / FIXTURE badge** so you always know where data came from.
- Force fixture mode with `?offline=1` (e.g. `/earth-obs?offline=1`).

## Deterministic science boundary

All resource mathematics, docking physics and quiz grading live in our own code
(`src/game/engine.js` and the mission components). **No language model computes any
number in this project.** AI was used only for scaffolding and drafting text —
see [`docs/AI_USE.md`](docs/AI_USE.md).

## Tech stack

React 18 · Vite · Tailwind CSS · React Router v6 · Lucide React · vite-plugin-pwa
(service worker) · LocalStorage (guarded with try/catch) · deployed on Vercel.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Optional API key (the demo works without it, in fixture mode):

```bash
copy .env.example .env     # then paste a free key from https://api.nasa.gov
```

Offline test: `npm run build && npm run preview`, then DevTools → Application →
Service Workers → **Offline** → refresh. The game still plays.

## Fixtures

`public/fixtures/` holds the exact bytes the demo needs: EPIC imagery, its metadata
record, and the written question bank. Regenerate with
`node scripts/fetch_epic_fixtures.mjs` when the EPIC endpoint is reachable.

## Accessibility

44px+ touch targets on game controls · keyboard playable · `prefers-reduced-motion`
respected · colour is never the only signal (icons + text accompany every state).

## Team

[NAMES AND ROLES]

## License

Apache-2.0 — see [LICENSE](LICENSE).
