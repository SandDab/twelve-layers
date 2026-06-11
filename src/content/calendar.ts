// Static calendar data: which months carry an anchor event.
// See GAME_DESIGN.md §9. Scene content for these events lands in M1+;
// for M0 this only drives the navigation shell's placeholder copy.

export type AnchorEvent = {
  month: number;
  name: string;
  focus: string;
  sceneId?: string;
};

export const ANCHOR_EVENTS: AnchorEvent[] = [
  {
    month: 1,
    name: 'New Year Court Audience',
    focus: 'Tutorial: checks, Rank gates, first faction contacts',
    sceneId: 'm1_new_year',
  },
  { month: 3, name: 'Cherry-Blossom Banquet & Utaawase', focus: 'Poem builder debut; public win/lose with gossip stakes' },
  { month: 4, name: 'Aoi Matsuri', focus: 'The carriage-place dispute — every option costs someone' },
  { month: 7, name: 'Tanabata', focus: 'Romance spotlight; poem exchanges accelerate' },
  { month: 8, name: 'Tsukimi Moon-Viewing', focus: 'Taste showcase; moongazing mini-scene', sceneId: 'm8_tsukimi_01' },
  { month: 11, name: 'Gosechi Dances → New Year Jimoku', focus: 'Finale: promotions list resolves the year' },
];

export function getAnchorEvent(month: number): AnchorEvent | undefined {
  return ANCHOR_EVENTS.find((e) => e.month === month);
}
