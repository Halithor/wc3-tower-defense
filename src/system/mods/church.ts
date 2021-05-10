import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Item, Subject} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';
import {
  CountTowersWithModuleComponent,
  DealDamageOnAttackComponent,
  TowerStatsComponet,
  UpdateTooltipOnEvent,
} from './standardComponents';

const priesthoodDamageMult = 0.15;
const priesthoodAttackType = AttackType.Cursed;

const bishopDamagePerPriestMult = 0.1;
const bishopAttackType = AttackType.Cursed;

const archbishopDamageBonusPerc = 20;

export namespace Holy {
  const priesthoodItemId = itemId('I00D');
  const archbishopItemId = itemId('I00F');

  const priestCounterComponent = new CountTowersWithModuleComponent(
    priesthoodItemId,
    `Increases the on attack damage for |cffffcc00Bishop|r modules by ${Math.round(
      100 * bishopDamagePerPriestMult
    )}%.`
  );
  const archBishopCounterComponent = new CountTowersWithModuleComponent(
    archbishopItemId,
    `Increases the bonus damage provided by |cffffcc00Priesthood|r and |cffffcc00Bishop|r modules by ${archbishopDamageBonusPerc}%.`
  );
  const damageBonusFromArchbishopComponent = new TowerStatsComponet(
    () =>
      TowerStats.damage(
        0,
        archBishopCounterComponent.count * archbishopDamageBonusPerc
      ),
    stats =>
      `|cffffcc00+${stats.damagePerc}%|r damage, ${archbishopDamageBonusPerc}% per tower with |cffffcc00Archbishop|r.`
  );

  const priestDamageComponent = new DealDamageOnAttackComponent(
    priesthoodDamageMult,
    priesthoodAttackType
  );
  export class Priesthood extends Module {
    static readonly itemId = priesthoodItemId;
    name = 'Priesthood';
    components = [
      priestDamageComponent,
      damageBonusFromArchbishopComponent,
      priestCounterComponent,
      new UpdateTooltipOnEvent(archBishopCounterComponent.eventChange),
    ];
  }

  const bishopDamageComponent = new DealDamageOnAttackComponent(
    () => bishopDamagePerPriestMult * priestCounterComponent.count,
    bishopAttackType,
    `An additional ${Math.round(
      bishopDamagePerPriestMult * 100
    )}% for each tower with |cffffcc00Priesthood|r.`
  );
  export class Bishop extends Module {
    static readonly itemId = itemId('I00E');
    name = 'Bishop';
    components = [
      bishopDamageComponent,
      damageBonusFromArchbishopComponent,
      new UpdateTooltipOnEvent(
        archBishopCounterComponent.eventChange,
        priestCounterComponent.eventChange
      ),
    ];
  }

  export class Archbishop extends Module {
    static readonly itemId = archbishopItemId;
    name = 'Archbishop';
    components = [archBishopCounterComponent];
    get description() {
      return '';
    }
  }
}
