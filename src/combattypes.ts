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
