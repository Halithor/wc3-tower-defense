import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {DamageSource, dealDamageOnHit, dealDamageSpell} from 'system/damage';
import {
  isUnitTower,
  TowerCategories,
  towerCategories,
} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Item, Subject} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';
import {
  CountTowersWithModuleComponent,
  DamageMultComponent,
  DisableModByCategoryComponent,
  DisableUniqueComponent,
  TowerStatsComponent,
  UpdateOnEventComponent,
} from './standardComponents';

const packHunterBonusDamage = 1;

const enrageCooldownReduction = 0.5;

const channelFeriocityDamageMult = 0.2;
const channelFeriocityAttackType = AttackType.Natural;

const sharpenedClawsDamageBonusPerc = 50;

export namespace Beast {
  const packHunterItemId = itemId('I005');
  const packHunterCounterComponent = new CountTowersWithModuleComponent(
    packHunterItemId
  );
  const packHunterDamageComponent = new TowerStatsComponent(
    () =>
      TowerStats.damage(
        Math.round(packHunterCounterComponent.count * packHunterBonusDamage),
        0
      ),
    stats =>
      `|cffffcc00+${stats.damage}|r damage, add +${packHunterBonusDamage} damage for each tower with |cffffcc00Pack Hunter|r.`
  );
  export class PackHunter extends Module {
    static readonly itemId = packHunterItemId;
    name = 'Pack Hunter';
    components = [
      packHunterCounterComponent,
      packHunterDamageComponent,
      new UpdateOnEventComponent(packHunterCounterComponent.event),
    ];
  }

  const enrageStats = new TowerStatsComponent(
    TowerStats.attackSpeed(-enrageCooldownReduction, 0),
    stats => `|cffffcc00${stats.cooldown}|r second cooldown (minimum 0.1).`
  );
  const enrageUnique = new DisableUniqueComponent();
  export class Enrage extends Module {
    static readonly itemId = itemId('I006');
    name = 'Enrage';
    components = [enrageStats, enrageUnique];
  }

  const ferocitySpellDamage = new DamageMultComponent(
    [DamageSource.Spell],
    channelFeriocityDamageMult,
    channelFeriocityAttackType
  );
  export class ChannelFerocity extends Module {
    static readonly itemId = itemId('I007');
    name = 'Channel Ferocity';
    components = [ferocitySpellDamage];
  }

  const clawsDamageComponent = new TowerStatsComponent(
    TowerStats.damage(0, sharpenedClawsDamageBonusPerc),
    stats => `|cffffcc00+${stats.damagePerc}%|r damage.`
  );
  const clawsDisableComponent = new DisableModByCategoryComponent(
    [TowerCategories.Melee],
    []
  );
  export class SharpenedClaws extends Module {
    static readonly itemId = itemId('I00A');
    name = 'Sharpened Claws';
    components = [clawsDamageComponent, clawsDisableComponent];
  }
}
