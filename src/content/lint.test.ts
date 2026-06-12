import { describe, expect, it } from 'vitest';
import type { Scene } from '../engine/scene';
import { CLASSES } from './classes';
import { KANZASHI } from './kanzashi';
import {
  lintCandidates,
  lintClasses,
  lintKanzashi,
  lintLoveInterests,
  lintNoEmDashes,
  lintPoemFragments,
  lintScenes,
  lintThemeTagCoverage,
} from './lint';
import { LOVE_INTERESTS } from './loveInterests';
import { POEM_FRAGMENTS } from './poems';
import { SCENES } from './scenes';

describe('lintScenes', () => {
  it('passes for the registered scene content', () => {
    expect(lintScenes(SCENES)).toEqual([]);
  });

  it('flags a goto referencing a missing node', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: '...',
            choices: [{ text: 'go nowhere', effects: [], goto: 'missing' }],
          },
        },
      },
    };

    expect(lintScenes(scenes)).toEqual(['bad/a: goto "missing" does not exist']);
  });

  it('flags a ripple referencing an unregistered scene', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: '...',
            choices: [
              {
                text: 'ripple to nowhere',
                effects: [{ kind: 'ripple', triggerMonth: 4, sceneId: 'm99_missing' }],
                goto: 'a',
              },
            ],
          },
        },
      },
    };

    expect(lintScenes(scenes)).toEqual([
      'bad/a: ripple references unregistered scene "m99_missing" (register a TODO stub scene with this id)',
    ]);
  });

  it('flags a check on an unknown attribute', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: '...',
            choices: [
              {
                text: 'bad check',
                check: { attr: 'luck' as never, min: 10 },
                effects: [],
                goto: 'a',
              },
            ],
          },
        },
      },
    };

    expect(lintScenes(scenes)).toEqual(['bad/a: choice "bad check" checks unknown attribute "luck"']);
  });

  it('flags a dynamic node with no fallbackBody', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: '',
            dynamic: { promptId: 'poem_reply', fallbackBody: '' },
          },
        },
      },
    };

    expect(lintScenes(scenes)).toEqual([
      'bad/a: dynamic node has no fallbackBody (GAME_DESIGN.md §17: every dynamic node needs a fully playable authored fallback)',
    ]);
  });

  it('flags an ifClass referencing an unknown class', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: '...',
            choices: [
              {
                text: 'bad background',
                ifClass: 'nobody' as never,
                effects: [],
                goto: 'a',
              },
            ],
          },
        },
      },
    };

    expect(lintScenes(scenes)).toEqual(['bad/a: choice "bad background" has unknown ifClass "nobody"']);
  });
});

describe('lintClasses', () => {
  it('passes for the registered class roster', () => {
    expect(lintClasses(CLASSES, SCENES)).toEqual([]);
  });

  it('flags a class whose attrs do not sum to 100', () => {
    const classes = {
      bad: {
        ...CLASSES.governors_heir,
        id: 'bad',
        attrs: { charisma: 30, allure: 25, rhetoric: 25, taste: 21 },
      },
    };

    expect(lintClasses(classes as never, SCENES)).toEqual(['class "bad": attrs sum to 101, expected 100']);
  });

  it('flags a startRobes entry that is not a registered robe', () => {
    const classes = {
      bad: { ...CLASSES.governors_heir, id: 'bad', startRobes: ['no_such_robe'] },
    };

    expect(lintClasses(classes as never, SCENES)).toEqual([
      'class "bad": startRobes references unregistered robe "no_such_robe"',
    ]);
  });

  it('flags a scheduledRipples entry that is not a registered scene', () => {
    const classes = {
      bad: {
        ...CLASSES.governors_heir,
        id: 'bad',
        scheduledRipples: [{ triggerMonth: 6, sceneId: 'm99_missing' }],
      },
    };

    expect(lintClasses(classes as never, SCENES)).toEqual([
      'class "bad": scheduledRipples references unregistered scene "m99_missing"',
    ]);
  });
});

describe('lintThemeTagCoverage', () => {
  // Per-event theme-tag coverage is warn-level until M5 and error-level
  // from M5 onward (REALIGNMENT.md Phase 2 step 4 / CLAUDE.md). Flip the
  // branch below to a bare `expect(...).toEqual([])` once M5 content
  // (months 4/7/8) is authored.
  it('passes for the registered scene content (warn-level until M5)', () => {
    const issues = lintThemeTagCoverage(SCENES);
    if (issues.length > 0) {
      console.warn(`[content-lint] theme-tag coverage gaps (error-level at M5):\n${issues.join('\n')}`);
    }
  });

  it('flags a scene with themeTags that does not cover all four tags', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: '...',
            choices: [
              { text: 'principle only', themeTags: ['principle'], effects: [], goto: 'a' },
            ],
          },
        },
      },
    };

    expect(lintThemeTagCoverage(scenes)).toEqual([
      'bad: missing a choice tagged with theme "restraint"',
      'bad: missing a choice tagged with theme "alignment"',
      'bad: missing a choice tagged with theme "grace"',
    ]);
  });
});

describe('lintKanzashi', () => {
  it('passes for the registered kanzashi roster', () => {
    expect(lintKanzashi(KANZASHI, SCENES)).toEqual([]);
  });

  it('flags a kanzashi whose deliverySceneId is not registered', () => {
    const kanzashi = {
      ...KANZASHI,
      kobai: { ...KANZASHI.kobai, deliverySceneId: 'm99_missing' },
    };

    expect(lintKanzashi(kanzashi, SCENES)).toEqual([
      'kanzashi "kobai": deliverySceneId references unregistered scene "m99_missing"',
    ]);
  });

  it('flags two kanzashi sharing the same theme', () => {
    const kanzashi = {
      ...KANZASHI,
      tsukikage: { ...KANZASHI.tsukikage, theme: KANZASHI.kobai.theme },
    };

    expect(lintKanzashi(kanzashi, SCENES)).toEqual([
      'kanzashi "tsukikage": theme "principle" is already used by another kanzashi',
    ]);
  });
});

describe('lintPoemFragments', () => {
  it('passes when all four language fields are present', () => {
    expect(
      lintPoemFragments([{ id: 'frag_1', jp: '梅', kana: 'うめ', romaji: 'ume', en: 'plum' }]),
    ).toEqual([]);
  });

  it('flags missing language fields', () => {
    expect(lintPoemFragments([{ id: 'frag_1', jp: '梅', en: 'plum' }])).toEqual([
      'poem fragment "frag_1": missing "kana"',
      'poem fragment "frag_1": missing "romaji"',
    ]);
  });

  it('passes for the registered poem fragment content', () => {
    expect(lintPoemFragments(POEM_FRAGMENTS)).toEqual([]);
  });
});

describe('lintNoEmDashes', () => {
  it('flags em and en dashes in body and choice text', () => {
    const scenes: Record<string, Scene> = {
      bad: {
        id: 'bad',
        title: 'Bad',
        startNode: 'a',
        nodes: {
          a: {
            id: 'a',
            body: 'A pause, an em dash— here.',
            choices: [{ text: 'An en dash – here.', effects: [], goto: 'a' }],
          },
        },
      },
    };

    expect(lintNoEmDashes(scenes)).toEqual([
      'bad/a: body contains an em dash or en dash',
      'bad/a: choice text "An en dash – here." contains an em dash or en dash',
    ]);
  });
});

describe('lintLoveInterests', () => {
  it('passes for the registered love interest roster', () => {
    expect(lintLoveInterests(LOVE_INTERESTS, SCENES)).toEqual([]);
  });

  it('flags a missing roster entry and an unregistered criticalChoice scene', () => {
    const { climber, ...rest } = LOVE_INTERESTS;
    const loveInterests = {
      ...rest,
      widow: { ...LOVE_INTERESTS.widow, criticalChoice: { sceneId: 'm99_missing', stage: 4 as const } },
    };
    void climber;

    expect(lintLoveInterests(loveInterests, SCENES)).toEqual([
      'loveInterests: missing definition for "climber"',
      'loveInterest "widow": criticalChoice references unregistered scene "m99_missing"',
    ]);
  });
});

describe('lintCandidates', () => {
  it('flags an unregistered curtain scene and an unmatched taste tag', () => {
    const candidates = [
      { id: 'test', tastes: ['nonexistent_tag'], curtainSceneId: 'm99_missing' },
    ];

    expect(lintCandidates(candidates, POEM_FRAGMENTS, SCENES)).toEqual([
      'candidate "test": curtainSceneId references unregistered scene "m99_missing"',
      'candidate "test": taste "nonexistent_tag" does not match any poem fragment imagery tag',
    ]);
  });
});
