import {Vec2, Effect, Angle} from 'w3lib/src/index';

const indicatorModel = 'Doodads\\Cinematic\\GlowingRunes\\GlowingRunes4.mdl';

export class CircleIndicator {
  private _radius: number;
  private _pos: Vec2;
  private effects: Effect[];

  public constructor(pos: Vec2, radius: number, effectCount: number) {
    this._pos = pos;
    this._radius = radius;
    this.effects = [];
    for (let i = 0; i < effectCount; i++) {
      this.effects[i] = new Effect(indicatorModel, pos);
      this.effects[i].scale = 0.4;
      this.effects[i].setTimeScale(5.0);
    }
    this.updateEffects();
  }

  public get pos(): Vec2 {
    return this._pos;
  }

  public set pos(pos: Vec2) {
    this._pos = pos;
    this.updateEffects();
  }

  public get radius(): number {
    return this._radius;
  }

  public set radius(radius: number) {
    this._radius = radius;
    this.updateEffects();
  }

  private updateEffects() {
    this.effects.forEach((effect, index) => {
      const angle = Angle.fromDegrees((360 / this.effects.length) * index);
      const pos = this.pos.polarOffset(angle, this.radius);
      effect.pos = pos.withTerrainZ();
      effect.setYaw(angle.radians);
    });
  }

  public remove() {
    this.effects.forEach(effect => {
      if (effect != null) {
        effect.destroy();
      }
    });
  }
}

export class LineIndicator {
  private _startPos: Vec2;
  private _endPos: Vec2;
  private _width: number;
  // Number of effects per/100 range
  private _effectDensity: number;

  private effectsLeft: Effect[];
  private effectsRight: Effect[];

  public constructor(
    startPos: Vec2,
    endPos: Vec2,
    width: number,
    effectDensity: number
  ) {
    this._startPos = startPos;
    this._endPos = endPos;
    this._width = width;
    this._effectDensity = effectDensity;

    this.effectsLeft = [];
    this.effectsRight = [];

    this.updateEffects();
  }

  private updateEffects() {
    const dir = this._startPos.normalizedPointerTo(this._endPos);
    const length = this._startPos.distanceTo(this._endPos);
    const effectCount = math.ceil((length / 100.0) * this._effectDensity) + 1;
    // Fix effects left
    const deltaLeft = effectCount - this.effectsLeft.length;
    const leftPos = this._startPos.add(
      dir.rotate(Angle.fromDegrees(-90)).scale(this._width)
    );
    for (let i = 0; i < deltaLeft; i++) {
      const eff = new Effect(indicatorModel, leftPos);
      eff.scale = 0.4;
      eff.setTimeScale(5.0);
      this.effectsLeft.push(eff);
    }
    for (let i = 0; i < deltaLeft * -1; i++) {
      this.effectsLeft.pop();
    }
    // fix em right
    const deltaRight = effectCount - this.effectsRight.length;
    const rightPos = this._startPos.add(
      dir.rotate(Angle.fromDegrees(-90)).scale(this._width)
    );
    for (let i = 0; i < deltaRight; i++) {
      const eff = new Effect(indicatorModel, rightPos);
      eff.scale = 0.4;
      eff.setTimeScale(5.0);
      this.effectsRight.push(eff);
    }
    for (let i = 0; i < deltaRight * -1; i++) {
      this.effectsRight.pop();
    }

    // Update all the effect locations.
    const spacing = length / (effectCount - 1);
    for (let i = 0; i < this.effectsLeft.length; i++) {
      const eff = this.effectsLeft[i];
      const pos = this._startPos
        .moveTowards(this._endPos, i * spacing)
        .add(dir.rotate(Angle.fromDegrees(-90)).scale(this._width / 2));
      eff.pos = pos.withTerrainZ();
    }
    for (let i = 0; i < this.effectsRight.length; i++) {
      const eff = this.effectsRight[i];
      const pos = this._startPos
        .moveTowards(this._endPos, i * spacing)
        .add(dir.rotate(Angle.fromDegrees(90)).scale(this._width / 2));
      eff.pos = pos.withTerrainZ();
    }
  }

  public remove() {
    this.effectsLeft.forEach(effect => {
      effect.destroy();
    });
    this.effectsRight.forEach(effect => {
      effect.destroy();
    });
  }

  public get startPos(): Vec2 {
    return this._startPos;
  }

  public set startPos(pos: Vec2) {
    this._startPos = pos;
    this.updateEffects();
  }

  public getEndPos(): Vec2 {
    return this._endPos;
  }

  public setEndPos(pos: Vec2) {
    this._endPos = pos;
    this.updateEffects();
  }

  public get width(): number {
    return this._width;
  }

  public set width(val: number) {
    this._width = val;
    this.updateEffects();
  }

  public get effectDensity(): number {
    return this._effectDensity;
  }

  public set effectDensity(val: number) {
    this._effectDensity = val;
    this.updateEffects();
  }
}
