import {AttackType} from 'combattypes';
import {UnitIds} from 'constants';
import {
  TowerCategories,
  TowerIds,
} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {Unit} from 'w3lib/src/index';

export function builderClassInfo(builder: Unit): ClassInfo | undefined {
  if (builder.typeId.equals(UnitIds.builderDruid)) {
    return classDruid;
  } else if (builder.typeId.equals(UnitIds.builderEngineer)) {
    return classEngineer;
  } else if (builder.typeId.equals(UnitIds.builderGravedigger)) {
    return classGravedigger;
  } else if (builder.typeId.equals(UnitIds.builderNorthern)) {
    return classNorthern;
  } else if (builder.typeId.equals(UnitIds.builderSorceress)) {
    return classSorceress;
  } else if (builder.typeId.equals(UnitIds.builderWarrior)) {
    return classWarrior;
  }
  return undefined;
}

export class ClassInfo {
  constructor(
    readonly name: string,
    readonly towerStats: TowerStats,
    readonly onTower: (towerInfo: TowerInfo) => void = () => {}
  ) {}
}

export const classNone = new ClassInfo(
  'None',
  TowerStats.attackType(AttackType.Physical),
  () => {}
);

export const classDruid = new ClassInfo(
  'Druid',
  TowerStats.attackType(AttackType.Natural),
  tower => {
    const categories = tower.categories;
    if (
      categories.indexOf(TowerCategories.Melee) > -1 ||
      categories.indexOf(TowerCategories.Spear) > -1 ||
      categories.indexOf(TowerCategories.Splash) > -1
    ) {
      tower.classStats = TowerStats.attackType(AttackType.Natural).merge(
        TowerStats.damage(1, 0)
      );
    }
  }
);

export const classEngineer = new ClassInfo(
  'Engineer',
  TowerStats.attackType(AttackType.Fire),
  tower => {
    const categories = tower.categories;
    if (
      categories.indexOf(TowerCategories.Sniper) > -1 ||
      categories.indexOf(TowerCategories.Siege) > -1
    ) {
      tower.classStats = TowerStats.attackType(AttackType.Fire).merge(
        TowerStats.range(200, 0)
      );
    }
  }
);

export const classGravedigger = new ClassInfo(
  'Gravedigger',
  TowerStats.attackType(AttackType.Cursed)
);

export const classNorthern = new ClassInfo(
  'Amaqjuaq',
  TowerStats.attackType(AttackType.Frost),
  tower => {
    const categories = tower.categories;
    if (categories.indexOf(TowerCategories.AoE) > -1) {
      tower.classStats = TowerStats.attackType(AttackType.Frost).merge(
        TowerStats.damage(1, 0)
      );
    }
    if (tower.unit.typeId.equals(TowerIds.stormbolt)) {
      tower.classStats = TowerStats.attackType(AttackType.Frost).merge(
        TowerStats.manaRegen(0, 50)
      );
    }
  }
);
export const classSorceress = new ClassInfo(
  'Sorceress',
  TowerStats.attackType(AttackType.Arcane),
  tower => {
    tower.classStats = TowerStats.attackType(AttackType.Arcane)
      .merge(TowerStats.mana(3, 0))
      .merge(TowerStats.manaRegen(0, 20));
  }
);

export const classWarrior = new ClassInfo(
  'Warrior',
  TowerStats.attackType(AttackType.Physical),
  tower => {
    const categories = tower.categories;
    if (categories.indexOf(TowerCategories.Melee) > -1) {
      tower.classStats = TowerStats.attackType(AttackType.Physical).merge(
        TowerStats.damage(2, 0)
      );
    }
  }
);
