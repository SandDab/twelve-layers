import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IkebanaGame } from './IkebanaGame';

describe('IkebanaGame', () => {
  it('placing and removing stems is tap-only and updates the live score', () => {
    render(<IkebanaGame month={1} onSubmit={vi.fn()} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // empty vase scores 0

    // Tap a spring stem from the tray to place it in the first empty slot.
    fireEvent.click(screen.getByRole('button', { name: 'Plum branch' }));

    // The vase slot now shows the placed stem, and the score updates live
    // (a single in-season heaven stem: 10 triad + 6 season + 0 space = 16).
    expect(screen.getAllByRole('button', { name: 'Plum branch' }).length).toBeGreaterThan(1);
    expect(screen.getByText('16')).toBeInTheDocument();

    // Tapping the placed stem removes it again.
    const slotButtons = screen
      .getAllByRole('button', { name: 'Plum branch' })
      .filter((b) => b.className.includes('ikebana-slot'));
    fireEvent.click(slotButtons[0]);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('confirming submits the current score result', () => {
    const onSubmit = vi.fn();
    render(<IkebanaGame month={1} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Arrangement' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ score: 0, tasteDelta: 0 }),
    );
  });
});
