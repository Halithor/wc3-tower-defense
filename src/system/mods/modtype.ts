import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {ItemId} from 'w3lib/src/common';
import {Unit, DamageInfo} from 'w3lib/src/index';

// ModType contains the info about a given mod. In general these are unique for an item id.
export class ModType {
  constructor(
    readonly itemId: ItemId,
    readonly name: string,
    readonly description: string,
    readonly stats: TowerStats,
    readonly handlers: {
      onAttackDamage?: (
        target: Unit,
        tower: TowerInfo,
        damageInfo: DamageInfo
      ) => DamageInfo | void;
      onSpellDamage?: (
        target: Unit,
        tower: TowerInfo,
        damageInfo: DamageInfo
      ) => DamageInfo | void;
      onSpellOrAttackDamage?: (
        target: Unit,
        tower: TowerInfo,
        damageInfo: DamageInfo
      ) => DamageInfo | void;
      onOnHitDamage?: (
        target: Unit,
        tower: TowerInfo,
        damageInfo: DamageInfo
      ) => DamageInfo | void;
      onAnyDamage?: (
        target: Unit,
        tower: TowerInfo,
        damageInfo: DamageInfo
      ) => DamageInfo | void;
    } = {}
  ) {}

  toString(): string {
    return `Mod(${this.name})`;
  }
}
