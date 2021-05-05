import {AttackType, DefenseType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {Item} from 'w3lib/src/index';

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
  abstract readonly name: string;
  abstract readonly description: string;
  abstract stats: TowerStats;

  constructor(readonly item: Item) {}

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
}
