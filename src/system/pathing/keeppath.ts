import {
  color,
  Color,
  doAfter,
  doPeriodicallyCounted,
  Effect,
  flashEffect,
  flashEffectDuration,
  Group,
  onAnyUnitConstructionCancel,
  onAnyUnitConstructionFinish,
  onAnyUnitConstructionStart,
  Timer,
  vec2,
  Vec2,
} from 'w3lib/src/index';
import {PathingChecker} from '../../lib/pathingchecker';

const defaultEffectPath =
  // 'Abilities\\Spells\\Human\\InnerFire\\InnerFireTarget.mdl';
  // 'Abilities\\Spells\\Other\\Aneu\\AneuTarget.mdl';
  'Abilities\\Spells\\Other\\GeneralAuraTarget\\GeneralAuraTarget.mdl';

const upperRight = vec2(32, 32);
const upperLeft = vec2(-32, 32);
const lowerRight = vec2(32, -32);
const lowerLeft = vec2(-32, -32);

// KeepPath prevents building structures that block a
export class KeepPath {
  private checker: PathingChecker;
  private path: Vec2[];
  private effects: Effect[] = [];

  private underconstruction: Group;

  private flashing: boolean = false;
  private flashingEffects: Effect[] = [];
  private flashingIdx: number = 0;
  private flashingCancel!: {cancel: () => void; timer: Timer};

  constructor(
    private readonly start: Vec2,
    private readonly end: Vec2,
    private readonly effectColor: Color = color(255, 255, 255),
    private readonly effectPath: string = defaultEffectPath
  ) {
    this.underconstruction = new Group();
    this.checker = new PathingChecker(start, end);
    this.path = this.checker.getPath();
    this.flashPath();

    onAnyUnitConstructionStart(constructing => {
      const locs = [
        constructing.pos.add(upperRight),
        constructing.pos.add(upperLeft),
        constructing.pos.add(lowerRight),
        constructing.pos.add(lowerLeft),
      ];

      if (
        !this.path.some(
          pos => locs.findIndex(pos2 => pos.x == pos2.x && pos.y == pos2.y) > -1
        )
      ) {
        return;
      }
      this.underconstruction.addUnit(constructing);
      const newPath = this.checker.getPath();
      if (newPath.length == 0) {
        print("|cffffcc00Can't construct building blocking the path!|r");
        this.flashPath();
        doAfter(0.0, () => {
          constructing.issueImmediateOrder(851976);
        });
        return;
      }
      this.path = newPath;
    });
    onAnyUnitConstructionCancel(canceled => {
      if (this.underconstruction.hasUnit(canceled)) {
        this.underconstruction.removeUnit(canceled);
        this.path = this.checker.getPath();
        this.flashPath();
      }
    });
    onAnyUnitConstructionFinish(constructed => {
      if (this.underconstruction.hasUnit(constructed)) {
        this.underconstruction.removeUnit(constructed);
      }
    });
  }

  get length(): number {
    return this.path.length;
  }

  private flashPath() {
    this.path.forEach(pos => {
      flashEffectDuration(this.effectPath, pos, 2);
    });
  }

  private showPath() {
    if (this.flashing) {
      // need to cancel flashing before we can re-do this.
      this.flashingCancel.cancel();
      this.flashing = false;
      this.flashingEffects.forEach(eff => eff.destroy());
      this.flashingEffects = [];
      for (let i = this.flashingIdx + 1; i < this.effects.length; i++) {
        this.effects[i].destroy();
      }
    } else {
      this.effects.forEach(eff => {
        eff.destroy();
      });
    }

    this.effects = [];
    this.path.forEach(pos => {
      const eff = new Effect(this.effectPath, pos);
      eff.setColor(
        this.effectColor.red,
        this.effectColor.green,
        this.effectColor.blue
      );
      // eff.setColorByPlayer(Players[this.effectColor]);
      this.effects.push(eff);
    });
  }

  // show the path direction by going along it and flashing it
  runPath() {
    // TODO FIX THIS
    if (this.flashing) {
      return;
    }
    this.flashing = true;
    this.flashingEffects = [];
    this.flashingCancel = doPeriodicallyCounted(
      0.15,
      this.effects.length,
      (_, idx) => {
        this.effects[idx].destroy();
        this.flashingIdx = idx;
        doAfter(0.15, () => {
          const eff = new Effect(this.effectPath, this.path[idx]);
          eff.setColor(
            this.effectColor.red,
            this.effectColor.green,
            this.effectColor.blue
          );
          // eff.setColorByPlayer(Players[this.effectColor]);
          this.flashingEffects.push(eff);
        });
      },
      () => {
        this.effects = this.flashingEffects;
        this.flashing = false;
      }
    );
  }
}
