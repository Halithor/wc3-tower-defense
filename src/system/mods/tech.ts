import {AttackType} from 'combattypes';
import {creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Subject, Subscription} from 'w3lib/src/index';
import {Component, Module} from './module';
import {
  CountNearbyTowersComponent,
  EmitOnAddRemoveComponent,
  TowerStatsComponent,
  UpdateOnEventComponent,
} from './standardComponents';

const crystalScopeRangePerc = 33;

const wiredConnectionRange = 190; // sqrt(128^2 + 128^2) + 5
const wiredConnectionDmgBonus = 3;

const targetingSystemFullBonusRange = 1000;
const targetingSystemAttackType = AttackType.Physical;

export namespace Tech {
  const scopeRange = new TowerStatsComponent(
    TowerStats.range(0, crystalScopeRangePerc)
  );
  export class CrystalScope extends Module {
    static readonly itemId = itemId('I00H');
    name = 'Crystal Scope';
    components = [scopeRange];
  }

  const subjectAnyWiredChange = new Subject<[]>();
  export class WiredConnection extends Module {
    static readonly itemId = itemId('I00G');
    name = 'Wired Connection';
    private counter = new CountNearbyTowersComponent(wiredConnectionRange);
    private wiredCounter = new CountNearbyTowersComponent(
      wiredConnectionRange,
      true,
      tower => {
        const hasIt =
          tower.unit.inventorySize > 0 &&
          tower.unit.hasItemOfType(WiredConnection.itemId);
        print(`wiredCounter ${tower.unit.name} | hasIt: ${hasIt}`);
        return hasIt;
      },
      [subjectAnyWiredChange]
    );
    private statsComp = new TowerStatsComponent(
      () =>
        TowerStats.damage(
          wiredConnectionDmgBonus *
            (this.counter.count + this.wiredCounter.count),
          0
        ),
      stats => [
        `|cffffcc00+${stats.damage}|r damage.`,
        `Each adjacent tower increases damage by ${wiredConnectionDmgBonus}.`,
        `Adjacent towers with a |cffffcc00${this.name}|r module double the bonus damage.`,
      ]
    );
    private changeEvent = new EmitOnAddRemoveComponent(subjectAnyWiredChange);
    components = [
      this.counter,
      this.wiredCounter,
      this.statsComp,
      this.changeEvent,
      new UpdateOnEventComponent(this.counter.event, this.wiredCounter.event),
    ];
  }

  class TargetingSystemDamageComponent implements Component {
    private sub?: Subscription;
    register(module: Module): void {
      this.sub = module.eventAttackDamage.subscribe((target, tower, info) => {
        const rangeMult =
          tower.unit.pos.distanceTo(target.unit.pos) /
          targetingSystemFullBonusRange;
        const dmg = info.damage * rangeMult;
        dealDamageOnHit(
          tower.unit,
          target.unit,
          dmg,
          true,
          targetingSystemAttackType
        );
      });
    }

    unregister(): void {
      this.sub?.unsubscribe();
    }

    description(): string {
      return `Deal bonus ${targetingSystemAttackType.nameColored} damage to targets, increasing with distance. The bonus scales linearly, with |cffffcc00100%|r bonus at ${targetingSystemFullBonusRange} range.`;
    }
  }
  export class LongRangeTargetingSystem extends Module {
    static readonly itemId = itemId('I00J');
    name = 'Long Range Targeting System';
    components = [new TargetingSystemDamageComponent()];
  }
}
