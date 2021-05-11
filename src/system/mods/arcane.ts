import {AttackType} from 'combattypes';
import {creep, Creep} from 'system/creeps/creep';
import {DamageSource, dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId, ItemId} from 'w3lib/src/common';
import {color, flashEffect, standardTextTag} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';
import {
  DamageFlatComponent,
  RestoreManaComponent,
  TowerStatsComponent,
} from './standardComponents';

const scryingStoneRange = 200;
const scryingStoneDamage = 2;
const scryingStoneAttackType = AttackType.Arcane;

const manaStoneFlatBonus = 5;
const manaStoneRegenBonus = 0.25;

const diviningRodManaRestored = 2;

export namespace Arcane {
  const scryingStoneRangeComponent = new TowerStatsComponent(
    TowerStats.range(scryingStoneRange, 0),
    stats => `|cffffcc00+${stats.range}|r range.`
  );
  const scryingStoneDamageComponent = new DamageFlatComponent(
    [DamageSource.Spell, DamageSource.Attack],
    scryingStoneDamage,
    scryingStoneAttackType
  );
  export class ScryingStone extends Module {
    static readonly itemId = itemId('I000');
    name = 'Scrying Stone';
    components = [scryingStoneRangeComponent, scryingStoneDamageComponent];
  }

  const manaStoneStats = new TowerStatsComponent(
    TowerStats.mana(manaStoneFlatBonus, 0).merge(
      TowerStats.manaRegen(manaStoneRegenBonus, 0)
    ),
    stats => [
      `|cffffcc00+${stats.manaMax}|r max mana.`,
      `|cffffcc00+${string.format('%.2f', stats.manaRegen)}|r mana/sec.`,
    ]
  );
  export class ManaStone extends Module {
    static readonly itemId = itemId('I001');
    name = 'Mana Stone';
    components = [manaStoneStats];
  }

  const rodManaRestore = new RestoreManaComponent(
    true,
    false,
    diviningRodManaRestored
  );
  export class DiviningRod extends Module {
    static readonly itemId = itemId('I002');
    name = 'Divining Rod';
    components = [rodManaRestore];
  }
}
