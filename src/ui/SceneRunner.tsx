import { resolveCheck } from '../engine/checks';
import type { IkebanaScoreResult } from '../engine/ikebana';
import { getSceneNode, isSceneEnd, type Scene } from '../engine/scene';
import type { Choice } from '../engine/scene';
import { IkebanaGame } from '../minigames/ikebana/IkebanaGame';
import { useGameStore } from '../state/gameStore';

type SceneRunnerProps = {
  scene: Scene;
  /** Called once the scene reaches an end node and is marked complete. */
  onComplete?: () => void;
};

export function SceneRunner({ scene, onComplete }: SceneRunnerProps) {
  const attributes = useGameStore((s) => s.attributes);
  const classId = useGameStore((s) => s.classId);
  const month = useGameStore((s) => s.month);
  const progress = useGameStore((s) => s.sceneProgress[scene.id]);
  const setSceneNode = useGameStore((s) => s.setSceneNode);
  const completeScene = useGameStore((s) => s.completeScene);
  const applyChoiceEffects = useGameStore((s) => s.applyChoiceEffects);
  const checkKanzashiAward = useGameStore((s) => s.checkKanzashiAward);

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

  function goto(nodeId: string, effects: Choice['effects'] = [], themeTags?: Choice['themeTags']) {
    if (effects.length > 0) {
      applyChoiceEffects(effects);
    }
    if (themeTags && themeTags.length > 0) {
      checkKanzashiAward(themeTags);
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

  function submitIkebana(result: IkebanaScoreResult) {
    const { ikebana } = node;
    if (!ikebana) return;
    applyChoiceEffects([{ kind: 'attr', attr: 'taste', delta: result.tasteDelta }]);
    goto(result.score >= ikebana.threshold ? ikebana.successNode : ikebana.failNode);
  }

  return (
    <section className="card scene-card">
      <p className="scene-speaker">{node.speaker ?? scene.title}</p>
      <p>{node.body}</p>

      {node.ikebana && <IkebanaGame month={month} onSubmit={submitIkebana} />}

      {node.next && (
        <button className="btn btn-accent" onClick={() => goto(node.next!)}>
          Continue
        </button>
      )}

      {node.choices && (
        <div className="choice-fan">
          {node.choices
            .filter((choice) => !choice.ifClass || choice.ifClass === classId)
            .map((choice, i) => {
              const passed = choice.check ? resolveCheck(choice.check, attributes) : true;
              return (
                <button
                  key={i}
                  className={`btn choice-card${passed ? '' : ' choice-card-failed'}`}
                  disabled={!passed}
                  onClick={() => goto(choice.goto, choice.effects, choice.themeTags)}
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
