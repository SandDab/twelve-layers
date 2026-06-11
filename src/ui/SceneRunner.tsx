import { resolveCheck } from '../engine/checks';
import { getSceneNode, isSceneEnd, type Scene } from '../engine/scene';
import type { Choice } from '../engine/scene';
import { useGameStore } from '../state/gameStore';

type SceneRunnerProps = {
  scene: Scene;
  /** Called once the scene reaches an end node and is marked complete. */
  onComplete?: () => void;
};

export function SceneRunner({ scene, onComplete }: SceneRunnerProps) {
  const attributes = useGameStore((s) => s.attributes);
  const progress = useGameStore((s) => s.sceneProgress[scene.id]);
  const setSceneNode = useGameStore((s) => s.setSceneNode);
  const completeScene = useGameStore((s) => s.completeScene);
  const applyChoiceEffects = useGameStore((s) => s.applyChoiceEffects);

  const currentNodeId = progress?.currentNode ?? scene.startNode;
  const node = getSceneNode(scene, currentNodeId);
  const atEnd = isSceneEnd(node);

  if (progress?.completed) {
    return (
      <section className="card scene-card">
        <p className="scene-speaker">{node.speaker ?? scene.title}</p>
        <p>{node.body}</p>
        <p className="scene-complete-note">— end of scene —</p>
      </section>
    );
  }

  function goto(nodeId: string, effects: Choice['effects'] = []) {
    if (effects.length > 0) {
      applyChoiceEffects(effects);
    }
    const target = getSceneNode(scene, nodeId);
    if (isSceneEnd(target)) {
      setSceneNode(scene.id, nodeId);
      completeScene(scene.id);
      onComplete?.();
    } else {
      setSceneNode(scene.id, nodeId);
    }
  }

  return (
    <section className="card scene-card">
      <p className="scene-speaker">{node.speaker ?? scene.title}</p>
      <p>{node.body}</p>

      {node.next && (
        <button className="btn btn-accent" onClick={() => goto(node.next!)}>
          Continue
        </button>
      )}

      {node.choices && (
        <div className="choice-fan">
          {node.choices.map((choice, i) => {
            const passed = choice.check ? resolveCheck(choice.check, attributes) : true;
            return (
              <button
                key={i}
                className={`btn choice-card${passed ? '' : ' choice-card-failed'}`}
                disabled={!passed}
                onClick={() => goto(choice.goto, choice.effects)}
              >
                {choice.text}
              </button>
            );
          })}
        </div>
      )}

      {atEnd && !progress?.completed && (
        <button
          className="btn btn-accent"
          onClick={() => {
            completeScene(scene.id);
            onComplete?.();
          }}
        >
          Close
        </button>
      )}
    </section>
  );
}
