import type { StaffRole } from '../engine/types';

// Staff slots, GAME_DESIGN.md §8. Each is a one-time koku cost on hire;
// going broke hiring all four and waiting for income to recover is the
// intended early-game squeeze.

export type StaffDefinition = {
  id: StaffRole;
  name: string;
  description: string;
  cost: number;
  incomeBonus: number; // steward: added to monthly income
  trainBonus: number; // poet-tutor: Rhetoric gain from the Train action
  restBonus: number; // gardener: Composure restored by the Rest action
};

export const STAFF_DEFINITIONS: Record<StaffRole, StaffDefinition> = {
  steward: {
    id: 'steward',
    name: 'Steward',
    description: 'Manages the estate ledger. +15 koku income per month.',
    cost: 80,
    incomeBonus: 15,
    trainBonus: 0,
    restBonus: 0,
  },
  poetTutor: {
    id: 'poetTutor',
    name: 'Poet-Tutor',
    description: 'Sharpens your verse. Rhetoric training gains doubled.',
    cost: 70,
    incomeBonus: 0,
    trainBonus: 4,
    restBonus: 0,
  },
  gardener: {
    id: 'gardener',
    name: 'Gardener',
    description: 'Tends the garden. Resting restores double the Composure.',
    cost: 50,
    incomeBonus: 0,
    trainBonus: 0,
    restBonus: 30,
  },
  seamstress: {
    id: 'seamstress',
    name: 'Seamstress',
    description: 'Maintains the wardrobe. Required to equip robes.',
    cost: 60,
    incomeBonus: 0,
    trainBonus: 0,
    restBonus: 0,
  },
};
