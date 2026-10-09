import { getRandomEvent } from './events.js';
import { BUILDINGS } from './buildings.js';

// Daily consumption per astronaut
const DAILY_CONSUMPTION = { oxygen: 2, water: 1.5, food: 1.2 };

export function createInitialState(settings) {
  return {
    settings,
    day: 0,
    resources: {
      oxygen: { current: 40 * settings.crewSize, max: 60 * settings.crewSize },
      water: { current: 30 * settings.crewSize, max: 45 * settings.crewSize },
      food: { current: 25 * settings.crewSize, max: 40 * settings.crewSize },
      electricity: { current: 20, max: 40 },
      spareParts: { current: 6, max: 20 },
      research: { current: 0, max: 9999 }
    },
    buildings: settings.buildings || [],
    crew: { size: settings.crewSize, wellbeing: 100 },
    alerts: [],
    eventLog: [],
    ended: false,
    endReason: null
  };
}

export function advanceDay(state) {
  if (state.ended) return state;
  
  let s = JSON.parse(JSON.stringify(state)); // Clone state
  s.day += 1;

  // 1. Calculate Power
  let powerGen = 0;
  let powerUse = 0;
  s.buildings.forEach(b => {
    const def = BUILDINGS[b.id];
    if (def.power > 0) powerGen += def.power;
    if (def.power < 0) powerUse += Math.abs(def.power);
  });
  
  const netPower = powerGen - powerUse;
  s.resources.electricity.current = Math.max(0, Math.min(s.resources.electricity.max, s.resources.electricity.current + netPower));
  const hasPower = s.resources.electricity.current > 0;

  // 2. Production (Only if power is available)
  if (hasPower) {
    s.buildings.forEach(b => {
      const def = BUILDINGS[b.id];
      if (def.id === 'oxygen') s.resources.oxygen.current += 6;
      if (def.id === 'water') s.resources.water.current += 5;
      if (def.id === 'greenhouse') s.resources.food.current += 2;
      if (def.id === 'workshop') s.resources.spareParts.current += 1;
      if (def.id === 'lab') s.resources.research.current += 3;
    });
  } else {
    s.alerts = [...s.alerts, { id: Date.now(), severity: 'critical', message: 'Power shortage! Systems offline.' }];
  }

  // 3. Crew Consumption
  s.resources.oxygen.current -= DAILY_CONSUMPTION.oxygen * s.crew.size;
  s.resources.water.current -= DAILY_CONSUMPTION.water * s.crew.size;
  s.resources.food.current -= DAILY_CONSUMPTION.food * s.crew.size;

  // 4. Clamp Resources
  s.resources.oxygen.current = Math.max(0, s.resources.oxygen.current);
  s.resources.water.current = Math.max(0, s.resources.water.current);
  s.resources.food.current = Math.max(0, s.resources.food.current);
  s.resources.spareParts.current = Math.min(s.resources.spareParts.max, s.resources.spareParts.current);

  // 5. Check Shortages & Wellbeing
  let shortages = [];
  if (s.resources.oxygen.current <= 0) shortages.push('Oxygen');
  if (s.resources.water.current <= 0) shortages.push('Water');
  if (s.resources.food.current <= 0) shortages.push('Food');
  if (!hasPower) shortages.push('Power');

  if (shortages.length > 0) {
    s.crew.wellbeing -= 15;
    s.alerts = [...s.alerts, { id: Date.now(), severity: 'critical', message: `Shortage: ${shortages.join(', ')}!` }];
  } else {
    s.crew.wellbeing = Math.min(100, s.crew.wellbeing + 2); // Recover if doing well
  }
  s.crew.wellbeing = Math.max(0, Math.min(100, s.crew.wellbeing));
  // 5.5 Random Events (Add this before checking end conditions)
  if (!s.pendingEvent) {
    const event = getRandomEvent();
    if (event) {
      s.pendingEvent = event;
    }
  }
  // 6. Check End Conditions
  if (s.crew.wellbeing <= 0) {
    s.ended = true;
    s.endReason = 'crew';
  } else if (s.day >= s.settings.duration) {
    s.ended = true;
    s.endReason = 'complete';
  }

  return s;
}