# Use of AI in this project

## Tools Used
- Claude, GitHub Copilot — Used for scaffolding React components, generating boilerplate code, writing the Vite PWA configuration, and drafting educational text.

## What the AI did
- Generated the first draft of the React UI components (e.g., `Landing.jsx`, `BaseBuilder.jsx`, `MissionControl.jsx`).
- Wrote the initial Vite PWA plugin configuration for offline caching (`vite.config.js`).
- Assisted in drafting the educational text and factual summaries for the Science Library (`src/game/science.js`).
- Helped structure the safe fetch wrapper (live → cache → fixture) for the NASA API integrations.

## What the AI did NOT do (Human Creative Work)
- **Core Gameplay & Physics:** The deterministic physics for the docking game (inertia, drift, friction, speed-limit collision) were designed, tuned, and validated by the human team.
- **Simulation Math:** The resource mathematics (oxygen/water consumption rates, power generation, crew wellbeing decay) in `src/game/engine.js` were written and balanced by humans.
- **Game Design:** The core gameplay loop (the 3 training missions, the base builder, the emergency events) was conceptualized and designed by the human team.
- **UI/UX Design:** The glassmorphism design system, color palette, and layout decisions in Tailwind CSS were made by the human team.
- **NASA Data Integration:** The decision to use NASA EPIC for Mission 3, the mapping of metadata to quiz questions, and the curation of the fixture data were done by humans.

## Prompts and Reasoning
We used AI to accelerate the development of standard UI patterns and boilerplate so we could focus our time on the deterministic science and game design. 

Prompts were highly iterative and specific, for example:
- *"Write a React component for a resource meter that changes color based on percentage."*
- *"Create a physics loop for a 2D docking game with drift and a fuel budget."*
- *"Generate a Vite PWA config that caches local JSON fixtures."*

Every AI-generated block of code was reviewed, tested, and integrated by the human team. No AI was used to compute the scientific or mathematical outcomes of the simulation.
