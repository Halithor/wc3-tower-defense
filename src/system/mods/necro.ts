import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {DamageSource, dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {
  Event,
  eventAnyUnitDeath,
  Item,
  Subject,
  Subscription,
} from 'w3lib/src/index';
import {
  Component,
  CountingEventComponent,
  ModDamageInfo,
  Module,
} from './module';
import {
  KillCountingComponent,
  DamageMultComponent,
  TowerStatsComponent,
  UpdateOnEventComponent,
} from './standardComponents';

const necromancyKillsNeeded = 20;
const necromancyBonusMana = 5;
const necromancyBonusDamageMult = 0.2;
const necromancyAttackType = AttackType.Cursed;

const soulBatteryRange = 300;
const soulBatteryRangeSq = soulBatteryRange * soulBatteryRange;
const soulBatteryMaxBonus = 300;

export namespace Necro {
  export class Necromancer extends Module {
    static readonly itemId = itemId('I008');
    name = 'Necromancy';

    private readonly killCounter = new KillCountingComponent();
    private get completed() {
      return this.killCounter.count >= necromancyKillsNeeded;
    }
    components = [
      this.killCounter,
      new TowerStatsComponent(
        () => {
          if (this.completed) {
            return TowerStats.mana(necromancyBonusMana, 0);
          }
          return TowerStats.empty();
        },
        stats => `|cffffcc00+${stats.manaMax}|r max mana.`
      ),
      new DamageMultComponent(
        [DamageSource.Spell],
        () => {
          if (this.completed) {
            return necromancyBonusDamageMult;
          }
          return 0;
        },
        necromancyAttackType
      ),
      new UpdateOnEventComponent(
        this.killCounter.event.filter(count => count <= necromancyKillsNeeded)
      ),
    ];

    get description(): string {
      if (this.completed) {
        return `|cff3399CCStatus:|r Training Completed`;
      } else {
        return `|cff3399CCStatus:|r Need ${
          necromancyKillsNeeded - this.killCounter.count
        } kills to finish training.`;
      }
    }
  }

  const towerSouls: {[key: number]: number} = {};
  class SoulBatteryCountNearbyDeaths
    extends CountingEventComponent
    implements Component {
    private subscription?: Subscription;

    register(module: Module): void {
      this.subscription = eventAnyUnitDeath.subscribe(dying => {
        if (!module.tower || !module.enabled) {
          return;
        }
        if (this.count >= soulBatteryMaxBonus) {
          return;
        }
        if (towerSouls[module.tower.unit.id] == dying.id) {
          // Already handled by another module.
          return;
        }
        const distSq = dying.pos.distanceToSq(module.tower.unit.pos);
        if (distSq > soulBatteryRangeSq) {
          return;
        }
        const soulBatteries = module.tower.mods.modules.filter(
          mod => mod instanceof SoulBattery
        ) as SoulBattery[];
        if (soulBatteries.length == 1) {
          this.incCount();
        } else {
          const chosenBattery =
            soulBatteries[Math.floor(Math.random() * soulBatteries.length)];
          chosenBattery.counter.forceIncrease();
        }
        towerSouls[module.tower.unit.id] = dying.id;
      });
    }
    unregister(): void {
      this.subscription?.unsubscribe();
    }
    description(): string {
      return 'Only one soul battery will be empowered on a tower.';
    }
    towerStats(): TowerStats {
      return TowerStats.empty();
    }

    forceIncrease() {
      this.incCount();
    }
  }
  export class SoulBattery extends Module {
    static readonly itemId = itemId('I009');
    name = 'Soul Battery';
    readonly counter = new SoulBatteryCountNearbyDeaths();
    components = [
      new TowerStatsComponent(
        () => TowerStats.damage(0, this.counter.count),
        stats =>
          `|cffffcc00+${stats.damagePerc}%|r damage, an additional 1% for each creep that dies within ${soulBatteryRange}. Max ${soulBatteryMaxBonus}% bonus.`
      ),
      this.counter,
      new UpdateOnEventComponent(this.counter.event),
    ];
  }
}
