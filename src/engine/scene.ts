import type { Check, ClassId, Effect, FactionId, ThemeTag } from './types';

export type NodeId = string;

/** Gate a choice on the player's current standing with a faction (GAME_DESIGN.md §9: "faction reputation surfacing"). */
export type FactionRepCondition = { faction: FactionId; min?: number; max?: number };

export type Choice = {
  text: string;
  check?: Check;
  // Only offered to players of this class (FNV-style `[Background: X]` options).
  ifClass?: ClassId;
  // Only offered if the player's reputation with this faction falls in range.
  ifFactionRep?: FactionRepCondition;
  // Kanzashi theme tags this choice satisfies (GAME_DESIGN.md §8).
  themeTags?: ThemeTag[];
  effects: Effect[];
  goto: NodeId;
};

/**
 * A checked ikebana performance (GAME_DESIGN.md §10): the player plays
 * the mini-game inline, then the scene branches on whether the score
 * met the threshold. The Taste effect from the score is applied either
 * way.
 */
export type IkebanaPerformance = {
  threshold: number;
  successNode: NodeId;
  failNode: NodeId;
};

/**
 * Dynamic dialogue socket (GAME_DESIGN.md §17, deferred feature). In v0.1
 * the engine always renders `fallbackBody` in place of `body` - dynamic
 * generation is a post-v0.1 feature and never gates progression or
 * mutates state. `body` should still be set to the same text as
 * `fallbackBody` so the node reads correctly wherever `dynamic` is
 * unsupported.
 */
export type DynamicSocket = {
  promptId: string;
  fallbackBody: string;
};

export type SceneNode = {
  id: NodeId;
  speaker?: string;
  body: string;
  choices?: Choice[];
  next?: NodeId;
  ikebana?: IkebanaPerformance;
  dynamic?: DynamicSocket;
};

export type Scene = {
  id: string;
  title: string;
  startNode: NodeId;
  nodes: Record<NodeId, SceneNode>;
};

export function getSceneNode(scene: Scene, nodeId: NodeId): SceneNode {
  const node = scene.nodes[nodeId];
  if (!node) {
    throw new Error(`Scene "${scene.id}" has no node "${nodeId}"`);
  }
  return node;
}

export function isSceneEnd(node: SceneNode): boolean {
  return !node.next && !node.ikebana && (!node.choices || node.choices.length === 0);
}
