import {color, Color} from 'w3lib/src/index';

export class AttackType {
  static Physical = new AttackType(
    'Physical',
    color(99, 66, 0),
    1,
    ATTACK_TYPE_MELEE
  );
  static Cursed = new AttackType(
    'Cursed',
    color(0, 66, 66),
    2,
    ATTACK_TYPE_PIERCE
  );
  static Fire = new AttackType(
    'Fire',
    color(0xff, 66, 0),
    3,
    ATTACK_TYPE_SIEGE
  );
  static Frost = new AttackType(
    'Frost',
    color(0, 0xcc, 0xcc),
    6,
    ATTACK_TYPE_HERO
  );
  static Natural = new AttackType(
    'Natural',
    color(33, 0xcc, 33),
    5,
    ATTACK_TYPE_CHAOS
  );
  static Arcane = new AttackType(
    'Arcane',
    color(0xcc, 33, 0xff),
    4,
    ATTACK_TYPE_MAGIC
  );
  static Whoknows = new AttackType(
    'WhoKnows',
    color(0, 0, 0),
    1,
    ATTACK_TYPE_MELEE
  );

  private constructor(
    readonly name: string,
    readonly color: Color,
    readonly index: number,
    readonly attackType: attacktype
  ) {}

  get nameColored(): string {
    return `${this.color.code}${this.name}|r`;
  }

  static invert(val: attacktype): AttackType {
    switch (val) {
      case ATTACK_TYPE_MELEE:
        return AttackType.Physical;
      case ATTACK_TYPE_PIERCE:
        return AttackType.Cursed;
      case ATTACK_TYPE_SIEGE:
        return AttackType.Fire;
      case ATTACK_TYPE_HERO:
        return AttackType.Frost;
      case ATTACK_TYPE_CHAOS:
        return AttackType.Natural;
      case ATTACK_TYPE_MAGIC:
        return AttackType.Arcane;
    }
    return AttackType.Whoknows;
  }
}

export class DefenseType {
  static readonly Flesh = new DefenseType(
    'Flesh',
    color(0, 0, 0),
    0,
    DEFENSE_TYPE_LIGHT
  );
  static readonly Unclean = new DefenseType(
    'Unclean',
    color(0, 0, 0),
    1,
    DEFENSE_TYPE_MEDIUM
  );
  static readonly Elemental = new DefenseType(
    'Elemental',
    color(0, 0, 0),
    2,
    DEFENSE_TYPE_LARGE
  );
  static readonly Natural = new DefenseType(
    'Natural',
    color(0, 0, 0),
    4,
    DEFENSE_TYPE_NORMAL
  );
  static readonly Construct = new DefenseType(
    'Construct',
    color(0, 0, 0),
    5,
    DEFENSE_TYPE_HERO
  );
  static readonly Demonic = new DefenseType(
    'Demonic',
    color(0, 0, 0),
    6,
    DEFENSE_TYPE_DIVINE
  );
  static readonly Mystical = new DefenseType(
    'Mystical',
    color(0, 0, 0),
    7,
    DEFENSE_TYPE_NONE
  );

  constructor(
    readonly name: string,
    readonly color: Color,
    readonly index: number,
    readonly type: defensetype
  ) {}

  get nameColored(): string {
    return `${this.color.code}${this.name}|r`;
  }

  static invert(val: defensetype): DefenseType {
    switch (val) {
      case DEFENSE_TYPE_LIGHT:
        return DefenseType.Flesh;
      case DEFENSE_TYPE_MEDIUM:
        return DefenseType.Unclean;
      case DEFENSE_TYPE_LARGE:
        return DefenseType.Elemental;
      case DEFENSE_TYPE_NORMAL:
        return DefenseType.Natural;
      case DEFENSE_TYPE_HERO:
        return DefenseType.Construct;
      case DEFENSE_TYPE_DIVINE:
        return DefenseType.Demonic;
      case DEFENSE_TYPE_NONE:
        return DefenseType.Mystical;
    }
    return DefenseType.Flesh;
  }
}
