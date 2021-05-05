import {AttackType} from 'combattypes';
import {creep, Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId, ItemId} from 'w3lib/src/common';
import {color, flashEffect, standardTextTag} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';

const scryingStoneRange = 200;
const scryingStoneDamage = 2;
const scryingStoneAttackType = AttackType.Arcane;

const manaStoneFlatBonus = 5;
const manaStoneRegenBonus = 0.25;

const diviningRodManaRestored = 2;
const diviningRodEffectPath = 'Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl';

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

  export class DiviningRod extends Module {
    static readonly itemId = itemId('I002');
    name = 'Divining Rod';
    description = `Restore ${diviningRodManaRestored} mana after each spell cast.`;
    stats = TowerStats.empty();

    onSpell(towerInfo: TowerInfo) {
      towerInfo.tower.mana += diviningRodManaRestored;
      flashEffect(diviningRodEffectPath, towerInfo.tower.pos);
      const tt = standardTextTag(towerInfo.tower.pos, '+2');
      tt.color = color(0, 99, 0xff);
    }
  }
}
