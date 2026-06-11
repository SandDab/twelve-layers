import type { ClassDef } from './classes';
import { getRobe } from './robes';
import type { Scene } from '../engine/scene';
import type { AttributeKey, ClassId } from '../engine/types';

const VALID_ATTRIBUTES: readonly AttributeKey[] = ['rank', 'charisma', 'allure', 'rhetoric', 'taste'];

const VALID_CLASS_IDS: readonly ClassId[] = ['governors_heir', 'judges_child', 'old_name', 'salon_child'];

export type PoemFragmentLike = {
  id: string;
  jp?: string;
  kana?: string;
  romaji?: string;
  en?: string;
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
