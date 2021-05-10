import {AttackType} from 'combattypes';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Module} from './module';
import {DealDamageOnAttackComponent} from './standardComponents';

const demonFireDamageBonusPerc = 0.2;
const demonFireAttackType = AttackType.Fire;

const demonFrostDamageBonusPerc = 0.2;
const demonFrostAttackType = AttackType.Frost;

export namespace Demon {
  const fireDamageComponent = new DealDamageOnAttackComponent(
    demonFireDamageBonusPerc,
    demonFireAttackType
  );
  export class DemonFire extends Module {
    static readonly itemId = itemId('I003');
    name = 'Demon Fire';
    components = [fireDamageComponent];
  }

  const frostDamageComponent = new DealDamageOnAttackComponent(
    demonFrostDamageBonusPerc,
    demonFrostAttackType
  );
  export class DemonFrost extends Module {
    static readonly itemId = itemId('I004');
    name = 'Demon Frost';
    components = [frostDamageComponent];
  }
}
