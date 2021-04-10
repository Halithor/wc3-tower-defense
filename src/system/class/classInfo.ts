import {AttackType} from 'combattypes';
import {UnitIds} from 'constants';
import {TowerStats} from 'system/towers/towerstats';
import {Unit} from 'w3lib/src/index';

export function builderClassInfo(builder: Unit): ClassInfo | undefined {
  if (builder.typeId.equals(UnitIds.builderDruid)) {
    return classDruid;
  } else if (builder.typeId.equals(UnitIds.builderEngineer)) {
    return classEngineer;
  } else if (builder.typeId.equals(UnitIds.builderGravedigger)) {
    return classGravedigger;
  } else if (builder.typeId.equals(UnitIds.builderFrozenSpirit)) {
    return classFrozenSpirit;
  } else if (builder.typeId.equals(UnitIds.builderSorceress)) {
    return classSorceress;
  } else if (builder.typeId.equals(UnitIds.builderWarrior)) {
    return classWarrior;
  }
  return undefined;
}

export class ClassInfo {
  constructor(readonly name: string, readonly towerStats: TowerStats) {}
}

export const classDruid = new ClassInfo(
  'Druid',
  TowerStats.attackType(AttackType.Natural)
);
export const classEngineer = new ClassInfo(
  'Engineer',
  TowerStats.attackType(AttackType.Fire)
);
export const classGravedigger = new ClassInfo(
  'Gravedigger',
  TowerStats.attackType(AttackType.Cursed)
);
export const classFrozenSpirit = new ClassInfo(
  'Frozen Spirit',
  TowerStats.attackType(AttackType.Frost)
);
export const classSorceress = new ClassInfo(
  'Sorceress',
  TowerStats.attackType(AttackType.Arcane)
);
export const classWarrior = new ClassInfo(
  'Warrior',
  TowerStats.attackType(AttackType.Physical)
);
