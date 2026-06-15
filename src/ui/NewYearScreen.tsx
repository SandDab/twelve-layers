import { getEnding } from '../content/endings';
import { useGameStore } from '../state/gameStore';

/**
 * The jimoku recap (GAME_DESIGN.md §4, §14): shown once at the New Year for
 * the year that just closed, before the player can act in the new year.
 */
export function NewYearScreen() {
  const jimokuResult = useGameStore((s) => s.jimokuResult);
  const year = useGameStore((s) => s.year);
  const acknowledgeJimoku = useGameStore((s) => s.acknowledgeJimoku);

  if (!jimokuResult) return null;

  const ending = getEnding(jimokuResult.endingId);

  return (
    <section className="card scene-card">
      <p className="scene-speaker">The Jimoku, Year {jimokuResult.year}</p>
      <h2 style={{ margin: 0 }}>{ending.title}</h2>
      <p>{ending.body}</p>
      <p className="stat-label">
        {jimokuResult.rankGain > 0
          ? `Rank +${jimokuResult.rankGain}`
          : 'No change in standing this year.'}
      </p>
      <button className="btn btn-accent" onClick={acknowledgeJimoku}>
        Begin Year {year}
      </button>
    </section>
  );
}
