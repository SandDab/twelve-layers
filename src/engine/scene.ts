import type { Check, ClassId, Effect, ThemeTag } from './types';

export type NodeId = string;

export type Choice = {
  text: string;
  check?: Check;
  // Only offered to players of this class (FNV-style `[Background: X]` options).
  ifClass?: ClassId;
  // Kanzashi theme tags this choice satisfies (GAME_DESIGN.md §8).
  themeTags?: ThemeTag[];
  effects: Effect[];
  goto: NodeId;
};

export type SceneNode = {
  id: NodeId;
  speaker?: string;
  body: string;
  choices?: Choice[];
  next?: NodeId;
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
  return !node.next && (!node.choices || node.choices.length === 0);
}
