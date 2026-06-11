import { describe, expect, it } from 'vitest';
import type { Scene } from '../engine/scene';
import { lintPoemFragments, lintScenes } from './lint';
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
});
