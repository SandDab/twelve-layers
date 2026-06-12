import type { ClassDef } from './classes';
import type { KanzashiDef, KanzashiId } from './kanzashi';
import { getRobe } from './robes';
import type { Scene } from '../engine/scene';
import type { AttributeKey, ClassId, FactionId, ThemeTag } from '../engine/types';

const VALID_ATTRIBUTES: readonly AttributeKey[] = ['rank', 'charisma', 'allure', 'rhetoric', 'taste'];

const VALID_CLASS_IDS: readonly ClassId[] = ['governors_heir', 'judges_child', 'old_name', 'salon_child'];

const VALID_FACTION_IDS: readonly FactionId[] = ['regent', 'rivalHouses', 'imperial', 'clergy'];

const VALID_THEME_TAGS: readonly ThemeTag[] = ['principle', 'restraint', 'alignment', 'grace'];

const VALID_KANZASHI_IDS: readonly KanzashiId[] = ['kobai', 'tsukikage', 'fuji', 'sango'];

export type PoemFragmentLike = {
  id: string;
  jp?: string;
  kana?: string;
  romaji?: string;
  en?: string;
  tags?: string[];
};

export type CandidateLike = {
  id: string;
  tastes: string[];
  curtainSceneId: string;
};

/**
 * Validate a registry of scenes: every `next`/`goto` must point at a node
 * that exists in the same scene, every ripple effect's `sceneId` must
 * reference a registered scene (a TODO stub is fine — dangling is not),
 * and every check's attribute must be a real attribute key.
 */
export function lintScenes(scenes: Record<string, Scene>): string[] {
  const errors: string[] = [];

  for (const scene of Object.values(scenes)) {
    if (!scene.nodes[scene.startNode]) {
      errors.push(`${scene.id}: startNode "${scene.startNode}" does not exist`);
    }

    for (const node of Object.values(scene.nodes)) {
      if (node.next && !scene.nodes[node.next]) {
        errors.push(`${scene.id}/${node.id}: next "${node.next}" does not exist`);
      }

      if (node.dynamic && !node.dynamic.fallbackBody) {
        errors.push(
          `${scene.id}/${node.id}: dynamic node has no fallbackBody (GAME_DESIGN.md §17: every dynamic node ` +
            `needs a fully playable authored fallback)`,
        );
      }

      if (node.ikebana) {
        if (!scene.nodes[node.ikebana.successNode]) {
          errors.push(`${scene.id}/${node.id}: ikebana successNode "${node.ikebana.successNode}" does not exist`);
        }
        if (!scene.nodes[node.ikebana.failNode]) {
          errors.push(`${scene.id}/${node.id}: ikebana failNode "${node.ikebana.failNode}" does not exist`);
        }
      }

      for (const choice of node.choices ?? []) {
        if (!scene.nodes[choice.goto]) {
          errors.push(`${scene.id}/${node.id}: goto "${choice.goto}" does not exist`);
        }

        if (choice.check && !VALID_ATTRIBUTES.includes(choice.check.attr)) {
          errors.push(
            `${scene.id}/${node.id}: choice "${choice.text}" checks unknown attribute "${choice.check.attr}"`,
          );
        }

        if (choice.ifClass && !VALID_CLASS_IDS.includes(choice.ifClass)) {
          errors.push(
            `${scene.id}/${node.id}: choice "${choice.text}" has unknown ifClass "${choice.ifClass}"`,
          );
        }

        if (choice.ifFactionRep && !VALID_FACTION_IDS.includes(choice.ifFactionRep.faction)) {
          errors.push(
            `${scene.id}/${node.id}: choice "${choice.text}" has unknown ifFactionRep faction "${choice.ifFactionRep.faction}"`,
          );
        }

        for (const tag of choice.themeTags ?? []) {
          if (!VALID_THEME_TAGS.includes(tag)) {
            errors.push(`${scene.id}/${node.id}: choice "${choice.text}" has unknown themeTag "${tag}"`);
          }
        }

        for (const effect of choice.effects) {
          if (effect.kind === 'attr' && !VALID_ATTRIBUTES.includes(effect.attr)) {
            errors.push(
              `${scene.id}/${node.id}: choice "${choice.text}" sets unknown attribute "${effect.attr}"`,
            );
          }

          if (effect.kind === 'ripple' && !scenes[effect.sceneId]) {
            errors.push(
              `${scene.id}/${node.id}: ripple references unregistered scene "${effect.sceneId}" ` +
                `(register a TODO stub scene with this id)`,
            );
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Validate the class roster (GAME_DESIGN.md §2): each class's attrs must
 * sum to exactly 100, every starting robe must be a registered robe id,
 * and every scheduled ripple must reference a registered scene.
 */
export function lintClasses(classes: Record<string, ClassDef>, scenes: Record<string, Scene>): string[] {
  const errors: string[] = [];

  for (const def of Object.values(classes)) {
    const sum = def.attrs.charisma + def.attrs.allure + def.attrs.rhetoric + def.attrs.taste;
    if (sum !== 100) {
      errors.push(`class "${def.id}": attrs sum to ${sum}, expected 100`);
    }

    for (const robeId of def.startRobes) {
      if (!getRobe(robeId)) {
        errors.push(`class "${def.id}": startRobes references unregistered robe "${robeId}"`);
      }
    }

    for (const ripple of def.scheduledRipples ?? []) {
      if (!scenes[ripple.sceneId]) {
        errors.push(
          `class "${def.id}": scheduledRipples references unregistered scene "${ripple.sceneId}"`,
        );
      }
    }
  }

  return errors;
}

/**
 * Validate that any scene carrying kanzashi themeTags covers all four
 * theme tags somewhere in its choices — every anchor event needs at
 * least one choice per tag, so all four kanzashi are reachable
 * regardless of their secret month assignment (CLAUDE.md, GAME_DESIGN.md §8).
 */
export function lintThemeTagCoverage(scenes: Record<string, Scene>): string[] {
  const errors: string[] = [];

  for (const scene of Object.values(scenes)) {
    const present = new Set<ThemeTag>();
    for (const node of Object.values(scene.nodes)) {
      for (const choice of node.choices ?? []) {
        for (const tag of choice.themeTags ?? []) {
          present.add(tag);
        }
      }
    }

    if (present.size === 0) continue;

    for (const tag of VALID_THEME_TAGS) {
      if (!present.has(tag)) {
        errors.push(`${scene.id}: missing a choice tagged with theme "${tag}"`);
      }
    }
  }

  return errors;
}

/**
 * Validate the kanzashi roster (GAME_DESIGN.md §8): exactly the four
 * expected ids, each with a valid and distinct theme tag, and a
 * deliverySceneId that resolves to a registered scene.
 */
export function lintKanzashi(kanzashi: Record<string, KanzashiDef>, scenes: Record<string, Scene>): string[] {
  const errors: string[] = [];

  for (const id of VALID_KANZASHI_IDS) {
    if (!kanzashi[id]) {
      errors.push(`kanzashi: missing definition for "${id}"`);
    }
  }

  const seenThemes = new Set<ThemeTag>();
  for (const def of Object.values(kanzashi)) {
    if (!VALID_THEME_TAGS.includes(def.theme)) {
      errors.push(`kanzashi "${def.id}": unknown theme "${def.theme}"`);
    } else if (seenThemes.has(def.theme)) {
      errors.push(`kanzashi "${def.id}": theme "${def.theme}" is already used by another kanzashi`);
    } else {
      seenThemes.add(def.theme);
    }

    if (!scenes[def.deliverySceneId]) {
      errors.push(`kanzashi "${def.id}": deliverySceneId references unregistered scene "${def.deliverySceneId}"`);
    }
  }

  return errors;
}

/**
 * Validate poem fragments carry all four language fields. No fragments
 * exist before M4; this keeps the lint forward-compatible with that
 * content authoring requirement (CLAUDE.md).
 */
export function lintPoemFragments(fragments: PoemFragmentLike[]): string[] {
  const errors: string[] = [];

  for (const fragment of fragments) {
    for (const field of ['jp', 'kana', 'romaji', 'en'] as const) {
      if (!fragment[field]) {
        errors.push(`poem fragment "${fragment.id}": missing "${field}"`);
      }
    }
  }

  return errors;
}

/**
 * Validate the romance candidate roster (GAME_DESIGN.md §6): each
 * candidate's curtainSceneId must resolve to a registered scene, and
 * every taste tag must be an imagery tag that actually appears on a
 * poem fragment (so the poem builder's taste-match scoring can fire).
 */
export function lintCandidates(
  candidates: CandidateLike[],
  fragments: PoemFragmentLike[],
  scenes: Record<string, Scene>,
): string[] {
  const errors: string[] = [];

  const validTags = new Set<string>();
  for (const fragment of fragments) {
    for (const tag of fragment.tags ?? []) {
      validTags.add(tag);
    }
  }

  for (const candidate of candidates) {
    if (!scenes[candidate.curtainSceneId]) {
      errors.push(
        `candidate "${candidate.id}": curtainSceneId references unregistered scene "${candidate.curtainSceneId}"`,
      );
    }

    for (const tag of candidate.tastes) {
      if (!validTags.has(tag)) {
        errors.push(`candidate "${candidate.id}": taste "${tag}" does not match any poem fragment imagery tag`);
      }
    }
  }

  return errors;
}

/**
 * Validate that no scene text uses em dashes or en dashes (CLAUDE.md
 * style guide: hyphens, commas, periods, or parentheses only).
 */
export function lintNoEmDashes(scenes: Record<string, Scene>): string[] {
  const errors: string[] = [];
  const dashPattern = /[–—]/;

  for (const scene of Object.values(scenes)) {
    for (const node of Object.values(scene.nodes)) {
      if (dashPattern.test(node.body)) {
        errors.push(`${scene.id}/${node.id}: body contains an em dash or en dash`);
      }

      for (const choice of node.choices ?? []) {
        if (dashPattern.test(choice.text)) {
          errors.push(`${scene.id}/${node.id}: choice text "${choice.text}" contains an em dash or en dash`);
        }
      }
    }
  }

  return errors;
}
