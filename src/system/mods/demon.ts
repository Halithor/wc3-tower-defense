import {AttackType} from 'combattypes';
import {DamageSource} from 'system/damage';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Module} from './module';
import {DamageMultComponent} from './standardComponents';

const demonFireDamageBonusPerc = 0.25;
const demonFireAttackType = AttackType.Fire;

const demonFrostDamageBonusPerc = 0.25;
const demonFrostAttackType = AttackType.Frost;

export namespace Demon {
  const fireDamageComponent = new DamageMultComponent(
    [DamageSource.Attack],
    demonFireDamageBonusPerc,
    demonFireAttackType
  );
  export class DemonFire extends Module {
    static readonly itemId = itemId('I003');
    name = 'Demon Fire';
    components = [fireDamageComponent];
  }

  const frostDamageComponent = new DamageMultComponent(
    [DamageSource.Attack],
    demonFrostDamageBonusPerc,
    demonFrostAttackType
  );
  export class DemonFrost extends Module {
    static readonly itemId = itemId('I004');
    name = 'Demon Frost';
    components = [frostDamageComponent];
  }
}
