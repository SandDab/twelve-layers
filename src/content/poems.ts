import type { PoemFragment } from '../engine/types';

// Poem fragment catalog (GAME_DESIGN.md §6 poem builder, §16 Romaji
// mode). Every fragment carries all four language fields at authoring
// time; Romaji mode (M4) displays `romaji`, Gloss/Immersion (M6) will
// add `jp`/`kana` display over this same data.
//
// Imagery tags, three per season, are intended to double as future love
// interests' `tastes` (GAME_DESIGN.md §6, M4a+):
//   spring: plum, cherry_blossom, mist
//   summer: cuckoo, iris, firefly
//   autumn: moon, maple, insects
//   winter: snow, pine, plover

export const POEM_FRAGMENTS: PoemFragment[] = [
  // --- Spring (season 1) ---
  {
    id: 'spring_season_1',
    slot: 'season',
    jp: '梅は雪より先に咲く',
    kana: 'うめはゆきよりさきにさく',
    romaji: 'the ume blooms before the snow is gone',
    en: 'the plum blooms before the snow is gone',
    season: 1,
    tags: ['plum'],
  },
  {
    id: 'spring_season_2',
    slot: 'season',
    jp: '桜は一夜にして開く',
    kana: 'さくらはひとよにしてひらく',
    romaji: 'the sakura opens overnight',
    en: 'the cherry opens overnight',
    season: 1,
    tags: ['cherry_blossom'],
  },
  {
    id: 'spring_image_1',
    slot: 'image',
    jp: '朝霧が門を隠す',
    kana: 'あさぎりがもんをかくす',
    romaji: 'the asagiri hides the garden gate',
    en: 'the morning mist hides the garden gate',
    season: 1,
    tags: ['mist'],
  },
  {
    id: 'spring_image_2',
    slot: 'image',
    jp: '梅の香が袖に残る',
    kana: 'うめのかがそでにのこる',
    romaji: 'a scent of ume caught on the sleeve',
    en: 'a plum scent caught on the sleeve',
    season: 1,
    tags: ['plum'],
  },
  {
    id: 'spring_turn_1',
    slot: 'turn',
    jp: '散りぬとも枝は忘れず',
    kana: 'ちりぬともえだはわすれず',
    romaji: 'though the sakura scatters, the branch remembers',
    en: 'though it scatters, the branch remembers',
    season: 1,
    tags: ['cherry_blossom'],
  },
  {
    id: 'spring_turn_2',
    slot: 'turn',
    jp: 'まだ晴れぬ霧のように',
    kana: 'まだはれぬきりのように',
    romaji: 'like the asagiri, it has not yet cleared',
    en: 'it has not yet cleared, and neither have I',
    season: 1,
    tags: ['mist'],
  },

  // --- Summer (season 2) ---
  {
    id: 'summer_season_1',
    slot: 'season',
    jp: 'ほととぎす一声過ぎぬ',
    kana: 'ほととぎすひとこえすぎぬ',
    romaji: 'the hototogisu calls once and is gone',
    en: 'the cuckoo calls once and is gone',
    season: 2,
    tags: ['cuckoo'],
  },
  {
    id: 'summer_season_2',
    slot: 'season',
    jp: 'あやめは水田に立つ',
    kana: 'あやめはみずたにたつ',
    romaji: 'the ayame stands in the flooded field',
    en: 'the iris stands in the flooded field',
    season: 2,
    tags: ['iris'],
  },
  {
    id: 'summer_image_1',
    slot: 'image',
    jp: '蛍火が庭を一度よぎる',
    kana: 'ほたるびがにわをいちどよぎる',
    romaji: 'a hotarubi crosses the garden once',
    en: 'a firefly crosses the garden once',
    season: 2,
    tags: ['firefly'],
  },
  {
    id: 'summer_image_2',
    slot: 'image',
    jp: '一声のあとは静か',
    kana: 'ひとこえのあとはしずか',
    romaji: 'after the hitokoe, the night is quiet',
    en: 'after the single cry, the night is quiet',
    season: 2,
    tags: ['cuckoo'],
  },
  {
    id: 'summer_turn_1',
    slot: 'turn',
    jp: '根は雨より深く通う',
    kana: 'ねはあめよりふかくかよう',
    romaji: 'the ayame’s roots run deeper than the rain',
    en: 'its roots run deeper than the rain can reach',
    season: 2,
    tags: ['iris'],
  },
  {
    id: 'summer_turn_2',
    slot: 'turn',
    jp: '消えぬ間に見せたかった',
    kana: 'きえぬまにみせたかった',
    romaji: 'before the hotarubi fades, I wanted you to see it',
    en: 'before it fades, I wanted you to see it',
    season: 2,
    tags: ['firefly'],
  },

  // --- Autumn (season 3) ---
  {
    id: 'autumn_season_1',
    slot: 'season',
    jp: '月は軒端を越えて昇る',
    kana: 'つきはのきばをこえてのぼる',
    romaji: 'the tsuki climbs past the eaves',
    en: 'the moon climbs past the eaves',
    season: 3,
    tags: ['moon'],
  },
  {
    id: 'autumn_season_2',
    slot: 'season',
    jp: '紅葉は時を待たず色づく',
    kana: 'もみじはときをまたずいろづく',
    romaji: 'the momiji turns before its time',
    en: 'the maple turns before its time',
    season: 3,
    tags: ['maple'],
  },
  {
    id: 'autumn_image_1',
    slot: 'image',
    jp: '虫の音が床下に鳴く',
    kana: 'むしのねがゆかしたになく',
    romaji: 'the mushi no ne sing under the floor',
    en: 'the insects sing under the floor',
    season: 3,
    tags: ['insects'],
  },
  {
    id: 'autumn_image_2',
    slot: 'image',
    jp: '月は雲間に隠れてまた出る',
    kana: 'つきはくもまにかくれてまたでる',
    romaji: 'the tsuki slips behind a cloud and back',
    en: 'the moon slips behind a cloud and back',
    season: 3,
    tags: ['moon'],
  },
  {
    id: 'autumn_turn_1',
    slot: 'turn',
    jp: '色変わるは葉ばかりならず',
    kana: 'いろかわるははばかりならず',
    romaji: 'even the momiji’s color changes before it falls',
    en: 'even color changes before it falls',
    season: 3,
    tags: ['maple'],
  },
  {
    id: 'autumn_turn_2',
    slot: 'turn',
    jp: '鳴き弱るほど耳を澄ます',
    kana: 'なきよわるほどみみをすます',
    romaji: 'as the mushi no ne grow faint, I listen harder',
    en: 'the singing grows fainter, and I listen harder',
    season: 3,
    tags: ['insects'],
  },

  // --- Winter (season 4) ---
  {
    id: 'winter_season_1',
    slot: 'season',
    jp: '雪はまだ降り積もらず',
    kana: 'ゆきはまだふりつもらず',
    romaji: 'the yuki has not yet settled',
    en: 'the snow has not yet settled',
    season: 4,
    tags: ['snow'],
  },
  {
    id: 'winter_season_2',
    slot: 'season',
    jp: '松は寒さに色を変えず',
    kana: 'まつはさむさにいろをかえず',
    romaji: 'the matsu holds its color through the cold',
    en: 'the pine holds its color through the cold',
    season: 4,
    tags: ['pine'],
  },
  {
    id: 'winter_image_1',
    slot: 'image',
    jp: '千鳥が渚に鳴く',
    kana: 'ちどりがなぎさになく',
    romaji: 'the chidori cry along the shore',
    en: 'the plovers cry along the shore',
    season: 4,
    tags: ['plover'],
  },
  {
    id: 'winter_image_2',
    slot: 'image',
    jp: '箱の蓋に静かに積もる',
    kana: 'はこのふたにしずかにつもる',
    romaji: 'the yuki piles quietly on the lid of the box',
    en: 'it piles quietly on the lid of the box',
    season: 4,
    tags: ['snow'],
  },
  {
    id: 'winter_turn_1',
    slot: 'turn',
    jp: '変わらぬ色のものは少なし',
    kana: 'かわらぬいろのものはすくなし',
    romaji: 'a color the matsu keeps, unlike most things',
    en: 'a color that does not change, unlike most things',
    season: 4,
    tags: ['pine'],
  },
  {
    id: 'winter_turn_2',
    slot: 'turn',
    jp: '声のみ届きて姿は見えず',
    kana: 'こえのみとどきてすがたはみえず',
    romaji: 'only the chidori’s voice carries, not the bird itself',
    en: 'only the voice carries, not the bird itself',
    season: 4,
    tags: ['plover'],
  },
];

export function getPoemFragment(id: string): PoemFragment | undefined {
  return POEM_FRAGMENTS.find((f) => f.id === id);
}

export function poemFragmentsBySlot(slot: PoemFragment['slot']): PoemFragment[] {
  return POEM_FRAGMENTS.filter((f) => f.slot === slot);
}
