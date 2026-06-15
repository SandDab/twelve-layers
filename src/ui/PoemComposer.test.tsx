import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PoemComposer } from './PoemComposer';
import { useGameStore } from '../state/gameStore';
import { createInitialSave } from '../engine/types';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState(createInitialSave());
});

describe('PoemComposer', () => {
  it('defaults to Romaji display and cycles through Gloss and Immersion (GAME_DESIGN.md §14 poem modes)', () => {
    const { container } = render(<PoemComposer recipientName="the Devotee" onCancel={vi.fn()} onSubmit={vi.fn()} />);
    const preview = () => container.querySelector('.poem-preview') as HTMLElement;

    // Romaji (default): preview shows the romaji line, not jp/en.
    expect(preview().textContent).toBe('the ume blooms before the snow is gone, the asagiri hides the garden gate, though the sakura scatters, the branch remembers.');
    expect(preview().textContent).not.toMatch(/梅は雪より先に咲く/);

    // Cycle to Gloss: jp, romaji, and en all shown together.
    fireEvent.click(screen.getByRole('button', { name: 'Romaji' }));
    expect(screen.getByRole('button', { name: 'Gloss' })).toBeInTheDocument();
    expect(preview().textContent).toMatch(/梅は雪より先に咲く/);
    expect(preview().textContent).toMatch(/the plum blooms before the snow is gone/);

    // Cycle to Immersion: jp/kana only, no romaji or English.
    fireEvent.click(screen.getByRole('button', { name: 'Gloss' }));
    expect(screen.getByRole('button', { name: 'Immersion' })).toBeInTheDocument();
    expect(preview().textContent).toMatch(/梅は雪より先に咲く/);
    expect(preview().textContent).not.toMatch(/the ume blooms before the snow is gone/);
    expect(preview().textContent).not.toMatch(/the plum blooms before the snow is gone/);

    // Cycle back to Romaji.
    fireEvent.click(screen.getByRole('button', { name: 'Immersion' }));
    expect(screen.getByRole('button', { name: 'Romaji' })).toBeInTheDocument();
  });
});
