/** @noSelfInFile **/
import {
  doPeriodically,
  Subject,
  forDestructablesInCircle,
  forUnitsInRange,
  vec3,
  Vec3,
} from 'w3lib/src/index';
import {Destructable, Effect, Unit, Vec2} from 'w3lib';

const interval = 0.03;

export class Projectile {
  fx: Effect;
  private releaseTimer: (this: void) => void;
  private _impactUnits = false;
  private _impactDestructables = false;
  private _destroyOnImpact = false;
  private originalDistance: number;
  private destFilter?: (d: Destructable) => boolean;
  private unitFilter?: (u: Unit) => boolean;
  vertSpeed: number;
  readonly onEnd: Subject<[]>;

  constructor(
    private pos: Vec3,
    private target: Vec3 | Unit,
    private groundSpeed: number,
    private gravity: number,
    effectPath: string,
    private onImpact: (target: Vec3 | Unit | Destructable, pos: Vec2) => void
  ) {
    this.onEnd = new Subject<[]>();
    this.fx = new Effect(effectPath, pos.withoutZ());
    this.fx.pos = pos;
    let targetPos: Vec3;
    if (target instanceof Vec3) {
      targetPos = target;
    } else {
      targetPos = target.pos.withTerrainZ();
    }
    this.fx.setYaw(pos.withoutZ().angleTo(targetPos.withoutZ()).radians);

    const endPeriodic = doPeriodically(interval, () => this.tick());
    this.releaseTimer = () => {
      endPeriodic.cancel();
    };

    this.originalDistance = pos.withoutZ().distanceTo(targetPos.withoutZ());
    const flightTime = this.originalDistance / groundSpeed;
    const z0 = pos.z;
    const zEnd = targetPos.z;
    // motion equation to land on the height of the platform targeted.
    this.vertSpeed =
      (zEnd - z0) / flightTime + (flightTime * this.gravity) / 2.0;
  }

  private tick() {
    let targetPos: Vec3;
    if (this.target instanceof Vec3) {
      targetPos = this.target;
    } else {
      targetPos = this.target.pos.withTerrainZ();
    }
    const groundPos = this.pos.withoutZ();
    const targetGroundPos = targetPos.withoutZ();
    const distance = groundPos.distanceTo(targetGroundPos);

    // const flightTime = distance / this.groundSpeed
    // const heightDiff = targetZ - this.fx.z
    // const verticalSpeed = heightDiff / flightTime - 0.5 * this.arc * flightTime
    this.vertSpeed = this.vertSpeed - this.gravity * interval;

    if (this.groundSpeed * interval >= distance) {
      this.onImpact(this.target, targetGroundPos);
      this.destroyProjectile();
    } else {
      const nextGroundPos = groundPos.moveTowards(
        targetGroundPos,
        this.groundSpeed * interval
      );
      const nextZ = math.max(
        this.pos.z + this.vertSpeed * interval,
        nextGroundPos.terrainZ + 80
      );
      const nextPos = nextGroundPos.withZ(nextZ);
      this.fx.pos = nextPos;
      this.pos = nextPos;

      if (this._impactUnits) {
        forUnitsInRange(nextGroundPos, 80, (u: Unit) => {
          if (!this.unitFilter || this.unitFilter(u)) {
            const absDist = u.pos
              .withTerrainZ()
              .add(vec3(0, 0, u.getflyHeight()))
              .distanceTo(nextPos);
            if (absDist > 100 + u.collisionSize) {
              // don't hit units if they're not on the same vertical position
              // as the projectile.
              return;
            }
            this.onImpact(u, nextGroundPos);
            if (this._destroyOnImpact) {
              this.destroyProjectile();
            }
          }
        });
      }
      if (this._impactDestructables) {
        forDestructablesInCircle(nextGroundPos, 80, (d: Destructable) => {
          if (!this.destFilter || this.destFilter(d)) {
            this.onImpact(d, nextGroundPos);
            if (this._destroyOnImpact) {
              this.destroyProjectile();
            }
          }
        });
      }
    }
  }

  public impactsUnits(value: boolean, filter?: (u: Unit) => boolean) {
    this._impactUnits = value;
    this.unitFilter = filter ? u => filter(u) : undefined;
  }

  public impactsDestructables(
    value: boolean,
    filter?: (d: Destructable) => boolean
  ) {
    this._impactDestructables = value;
    this.destFilter = filter ? d => filter(d) : undefined;
  }

  private destroyProjectile() {
    this.fx.destroy();
    this.releaseTimer();
    this.onEnd.fire();
  }
}
