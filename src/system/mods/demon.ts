import {AttackType} from 'combattypes';
import {isUnitCreep} from 'constants';
import {DamageSource, dealDamageOnHit} from 'system/damage';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {
  doPeriodically,
  flashEffect,
  forUnitsInRange,
  Subject,
  Subscription,
} from 'w3lib/src/index';
import {Component, Module} from './module';
import {DamageMultComponent, TowerStatsComponent} from './standardComponents';

const demonFireDamageBonusPerc = 0.25;
const demonFireAttackType = AttackType.Fire;

const demonFrostDamageBonusPerc = 0.25;
const demonFrostAttackType = AttackType.Frost;

const immloationDamageMult = 0.2;
const immolationAttackType = AttackType.Fire;
const immolationAtkDmgDecreasePerc = 50;
const immolationEffectPath =
  'Environment\\SmallBuildingFire\\SmallBuildingFire2.mdl';
// 'Abilities\\Spells\\NightElf\\Immolation\\ImmolationDamage.mdl';

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

  let immoTimer: Object;
  const immolationTick = new Subject<[]>();
  class ImmolationDamage implements Component {
    private sub?: Subscription;
    register(module: Module): void {
      if (!immoTimer) {
        immoTimer = doPeriodically(1, () => {
          immolationTick.emit();
        });
      }
      this.sub = immolationTick.subscribe(() => {
        const tower = module.tower;
        if (!tower) {
          return;
        }
        const dmg =
          immloationDamageMult * tower.stats.integratePercentages().damage;
        forUnitsInRange(tower.unit.pos, 150, u => {
          if (!isUnitCreep(u) || !u.isAlive()) {
            return;
          }
          dealDamageOnHit(tower.unit, u, dmg, false, immolationAttackType);
          flashEffect(immolationEffectPath, u.pos, 0.8);
        });
      });
    }
    unregister(): void {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    }
    description() {
      return `Every second, deal |cffffcc00${Math.round(
        100 * immloationDamageMult
      )}%|r of attack damage as ${
        immolationAttackType.nameColored
      } damage to all nearby units`;
    }
  }
  const immoDamageComponent = new ImmolationDamage();
  const immoAtkSpdComponent = new TowerStatsComponent(
    TowerStats.damage(0, -immolationAtkDmgDecreasePerc),
    stats => `|cffaa0000${stats.damagePerc}%|r attack damage.`
  );
  export class Immolation extends Module {
    static readonly itemId = itemId('I00I');
    name = 'Immolation';
    components = [immoDamageComponent, immoAtkSpdComponent];
  }
}
