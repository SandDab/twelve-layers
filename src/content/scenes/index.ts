import type { Scene } from '../../engine/scene';
import { envyRival } from './envyRival';
import { m1NewYear } from './m1NewYear';
import { m4NewYearEcho } from './m4NewYearEcho';

export const SCENES: Record<string, Scene> = {
  [m1NewYear.id]: m1NewYear,
  [m4NewYearEcho.id]: m4NewYearEcho,
  [envyRival.id]: envyRival,
};

export function getScene(id: string): Scene | undefined {
  return SCENES[id];
}
