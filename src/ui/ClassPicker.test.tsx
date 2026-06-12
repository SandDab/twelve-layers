import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ClassPicker } from './ClassPicker';
import { useGameStore } from '../state/gameStore';
import { createInitialSave } from '../engine/types';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState(createInitialSave());
});

describe('ClassPicker', () => {
  it('defaults to "A daughter" and lets the player switch to "A son" before choosing a class', () => {
    render(<ClassPicker />);

    expect(screen.getByRole('button', { name: 'A daughter' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'A son' })).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'A son' }));

    expect(screen.getByRole('button', { name: 'A son' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets pcGender and applies class effects (M1.5 acceptance: a measurably different game per class)', () => {
    render(<ClassPicker />);

    fireEvent.click(screen.getByRole('button', { name: 'A son' }));
    fireEvent.click(screen.getByRole('button', { name: "Choose The Old Name" }));

    const state = useGameStore.getState();
    expect(state.pcGender).toBe('male');
    expect(state.classId).toBe('old_name');
    // The Old Name's liability: lowest starting Koku, and a month-6 debt ripple queued at game start.
    expect(state.resources.koku).toBe(50);
    expect(state.rippleQueue).toContainEqual(
      expect.objectContaining({ triggerMonth: 6, sceneId: 'old_name_debt_01' }),
    );
  });
});
