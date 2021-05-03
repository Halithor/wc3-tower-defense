import {AttackType} from 'combattypes';
import {creep, Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId, ItemId} from 'w3lib/src/common';
import {ModDamageInfo, Module} from './module';

const scryingStoneRange = 200;
const scryingStoneDamage = 2;
const scryingStoneAttackType = AttackType.Arcane;

const manaStoneFlatBonus = 5;
const manaStoneRegenBonus = 0.25;

export namespace Arcane {
  export class ScryingStone extends Module {
    static readonly itemId = itemId('I000');
    name = 'Scrying Stone';
    description = `Bonuses:|n+ ${scryingStoneRange} range|n+ ${scryingStoneDamage}  on spell or attacks`;
    stats = TowerStats.range(scryingStoneRange, 0);

    onAttackDamage(
      target: Creep,
      tower: TowerInfo,
      _damageInfo: ModDamageInfo
    ) {
      dealDamageOnHit(
        tower.tower,
        target.unit,
        scryingStoneDamage,
        true,
        scryingStoneAttackType
      );
    }
  }

  export class ManaStone extends Module {
    static readonly itemId = itemId('I001');
    name = 'Mana Stone';
    description = `Bonuses:|n+ ${manaStoneFlatBonus} mana|n+ ${Math.round(
      100 * manaStoneRegenBonus
    )}% mana regen`;
    stats = TowerStats.mana(manaStoneFlatBonus, 0).merge(
      TowerStats.manaRegen(0.25, 0)
    );
  }
}
