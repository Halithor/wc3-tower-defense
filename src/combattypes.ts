export enum AttackType {
  Physical,
  Cursed,
  Fire,
  Frost,
  Natural,
  Arcane,
}

export function attackTypeString(val: AttackType): string {
  switch (val) {
    case AttackType.Physical:
      return 'Physical';
    case AttackType.Cursed:
      return 'Cursed';
    case AttackType.Fire:
      return 'Fire';
    case AttackType.Frost:
      return 'Frost';
    case AttackType.Natural:
      return 'Natural';
    case AttackType.Arcane:
      return 'Arcane';
    default:
      const _checkExhaustive: never = val;
      throw new Error('should not happen');
  }
}

export function attackTypeIndex(val: AttackType): number {
  switch (val) {
    case AttackType.Physical:
      return 1;
    case AttackType.Cursed:
      return 2;
    case AttackType.Fire:
      return 3;
    case AttackType.Frost:
      return 6;
    case AttackType.Natural:
      return 5;
    case AttackType.Arcane:
      return 4;
    default:
      const _checkExhaustive: never = val;
      throw new Error('should not happen');
  }
}

export function attackTypeConvert(val: AttackType): attacktype {
  switch (val) {
    case AttackType.Physical:
      return ATTACK_TYPE_MELEE;
    case AttackType.Cursed:
      return ATTACK_TYPE_PIERCE;
    case AttackType.Fire:
      return ATTACK_TYPE_SIEGE;
    case AttackType.Frost:
      return ATTACK_TYPE_HERO;
    case AttackType.Natural:
      return ATTACK_TYPE_CHAOS;
    case AttackType.Arcane:
      return ATTACK_TYPE_MAGIC;
    default:
      const _checkExhaustive: never = val;
      throw new Error('should not happen');
  }
}

export function attackTypeInvert(val: attacktype): AttackType {
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
  return AttackType.Physical;
}

export enum DefenseType {
  Flesh,
  Unclean,
  Elemental,
  Natural,
  Construct,
  Demonic,
  Mystical,
}

export function defenseTypeString(val: DefenseType): string {
  switch (val) {
    case DefenseType.Flesh:
      return 'Flesh';
    case DefenseType.Unclean:
      return 'Unclean';
    case DefenseType.Elemental:
      return 'Elemental';
    case DefenseType.Natural:
      return 'Natural';
    case DefenseType.Construct:
      return 'Construct';
    case DefenseType.Demonic:
      return 'Demonic';
    case DefenseType.Mystical:
      return 'Mystical';
    default:
      const _checkExhaustive: never = val;
      throw new Error('should not happen');
  }
}

export function defenseTypeIndex(val: DefenseType): number {
  switch (val) {
    case DefenseType.Flesh:
      return 0;
    case DefenseType.Unclean:
      return 1;
    case DefenseType.Elemental:
      return 2;
    case DefenseType.Natural:
      return 4;
    case DefenseType.Construct:
      return 5;
    case DefenseType.Demonic:
      return 6;
    case DefenseType.Mystical:
      return 7;
    default:
      const _checkExhaustive: never = val;
      throw new Error('should not happen');
  }
}
