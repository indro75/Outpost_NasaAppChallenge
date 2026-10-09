export const EVENTS = [
  {
    id: 'solarFailure',
    title: 'Solar Array Damage',
    description: 'A micrometeorite has damaged a panel connection. Output is reduced.',
    severity: 'warning',
    choices: [
      {
        label: 'Repair using spare parts (-2 parts)',
        cost: { spareParts: 2 },
        effect: { electricity: 10 },
        outcome: 'Crew patched the array. Power restored.'
      },
      {
        label: 'Reduce nonessential power',
        effect: { wellbeing: -5 },
        outcome: 'Nonessential systems powered down. Crew is uncomfortable.'
      }
    ]
  },
  {
    id: 'waterLeak',
    title: 'Water Line Leak',
    description: 'A pipe joint has failed. Water is being lost rapidly.',
    severity: 'critical',
    choices: [
      {
        label: 'Seal the leak (-1 spare part)',
        cost: { spareParts: 1 },
        effect: {},
        outcome: 'Leak sealed. Loss stopped.'
      },
      {
        label: 'Ration water usage',
        effect: { water: -15, wellbeing: -10 },
        outcome: 'Lost 15 units of water. Crew is thirsty.'
      }
    ]
  },
  {
    id: 'discovery',
    title: 'Scientific Discovery',
    description: 'The lab produced an unexpected result!',
    severity: 'info',
    choices: [
      {
        label: 'Celebrate and publish (+5 research)',
        effect: { research: 5, wellbeing: 10 },
        outcome: 'Morale boosted. Research points awarded.'
      }
    ]
  }
];

export function getRandomEvent() {
  // 30% chance of an event happening on any given day
  if (Math.random() > 0.3) return null; 
  const randomIndex = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[randomIndex];
}