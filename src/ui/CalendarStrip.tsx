import { getKasanePalette } from '../styles/kasanePalettes';

type CalendarStripProps = {
  month: number;
};

export function CalendarStrip({ month }: CalendarStripProps) {
  return (
    <div className="calendar-strip" role="tablist" aria-label="Calendar">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
        <div
          key={m}
          className={`month-chip${m === month ? ' active' : ''}`}
          aria-current={m === month}
          title={getKasanePalette(m).en}
        >
          {m}
        </div>
      ))}
    </div>
  );
}
