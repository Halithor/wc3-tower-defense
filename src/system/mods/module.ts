import {AttackType, DefenseType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {doAfter, Item} from 'w3lib/src/index';

export type ModDamageInfo = {
  damage: number;
  attackType: AttackType;
  targetDefenseType: DefenseType;
  damageType: damagetype;
  weaponType: weapontype;
  isSpell: boolean;
  isMeleeAttack: boolean;
  isRangedAttack: boolean;
};

export abstract class Module {
  // The tower that currently holds this module. Can be undefined if not held.
  tower?: TowerInfo;

  abstract readonly name: string;
  abstract get stats(): TowerStats;
  abstract get description(): string;

  constructor(readonly item: Item) {
    doAfter(0, () => this.updateTooltip());
  }

  onAdd(tower: TowerInfo) {}
  onRemove(tower: TowerInfo) {}

  onAttack(target: Creep, tower: TowerInfo) {}

  onKill(target: Creep, tower: TowerInfo) {}

  onSpell(tower: TowerInfo) {}

  onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}
  onSpellDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}
  onSpellOrAttackDamage(
    target: Creep,
    tower: TowerInfo,
    damageInfo: ModDamageInfo
  ) {}
  onOnHitDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}
  onAnyDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}

  updateTooltip() {
    this.item.tooltipExtended = this.description;
  }
}
