import type { EndingId } from '../engine/types';

// Year-end jimoku ending slates (GAME_DESIGN.md §4, §14). The ending id
// is computed by src/engine/jimoku.ts; this file holds only the display
// text, shown once at the following New Year.

export type EndingDef = {
  id: EndingId;
  title: string;
  body: string;
};

export const ENDINGS: Record<EndingId, EndingDef> = {
  behind_the_curtain: {
    id: 'behind_the_curtain',
    title: 'Behind the Curtain',
    body:
      'The promotions list is read out in the usual order, names and offices, ' +
      'and you listen to perhaps half of it. The other half of your attention ' +
      'is already across the garden, behind a curtain that has, this year, ' +
      'started opening when you arrive. Whatever your rank turns out to be, ' +
      'it is not, this year, the thing you are thinking about.',
  },
  overextended: {
    id: 'overextended',
    title: "The Season's Name, and the Cost of It",
    body:
      'Your name is read early, and the room does the thing rooms do when a ' +
      'name is read early, a small collective intake of breath, half ' +
      'admiration and half arithmetic. Afterward, a note arrives from a house ' +
      'you displaced at the carriage-place in spring, congratulating you with ' +
      'a warmth that does not survive close reading. You were the season\'s ' +
      'name. Someone else is already planning next season.',
  },
  estranged: {
    id: 'estranged',
    title: 'Estranged',
    body:
      'The list is read, your name lands where it lands, and afterward the ' +
      'usual cluster of well-wishers thins out a step sooner than it might ' +
      'have. A house that once sent New Year gifts sends, this year, only the ' +
      'minimum the season requires. Nothing is said outright; nothing needs to ' +
      'be. The capital is large enough that this need not be the end of ' +
      'anything, only the quiet start of being someone other people are ' +
      'careful around.',
  },
  toast_of_the_capital: {
    id: 'toast_of_the_capital',
    title: 'Toast of the Capital',
    body:
      'The list is read, your name lands a little higher than it did last New ' +
      'Year, and the congratulations that follow have the easy, unguarded ' +
      'quality of people who mean them. It has been, by most accounts, a good ' +
      'year, the kind that gets mentioned again next New Year as the year ' +
      'things began to go well, and the one after that as the year everyone ' +
      'first started saying your name without having to be told who you were.',
  },
  quiet_advancement: {
    id: 'quiet_advancement',
    title: 'Quiet Advancement',
    body:
      'The list is read, your name lands a step above where it stood, and the ' +
      'room moves on to the next name before the moment can become anything ' +
      'larger than it is. No one composes a poem about it. By the following ' +
      'week, though, a door or two that used to require an introduction no ' +
      'longer does, and that, in the end, is most of what a year at court is ' +
      'for.',
  },
  unremarked_year: {
    id: 'unremarked_year',
    title: 'The Unremarked Year',
    body:
      'The list is read, your name lands where it has always landed, and the ' +
      'room moves on without pausing. It was, by most accounts, a quiet year: ' +
      'no scandal, no triumph, a great many ordinary mornings spent on ' +
      'ordinary things. Whether that counts as nothing or as the only kind of ' +
      'year worth having twelve of in a row is a question the New Year ' +
      'audience, sensibly, declines to settle.',
  },
};

export function getEnding(id: EndingId): EndingDef {
  return ENDINGS[id];
}
