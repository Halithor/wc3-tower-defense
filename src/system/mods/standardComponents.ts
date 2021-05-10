import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {Event, ItemId, Subject, Subscription} from 'w3lib/src/index';
import {Component, ModDamageInfo, Module} from './module';

export class UpdateTooltipOnEvent implements Component {
  private module!: Module;
  private subscriptions: Subscription[];

  constructor(...events: Event<unknown[]>[]) {
    this.subscriptions = events.map(event =>
      event.subscribe(() => {
        if (this.module.tower) {
          this.module.tower.mods.change.emit();
          return;
        }
        this.module.updateTooltip();
      })
    );
  }

  register(module: Module): void {
    this.module = module;
  }
  unregister(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  description(): string {
    return '';
  }

  towerStats(): TowerStats {
    return TowerStats.empty();
  }
}

export class DealDamageOnAttackComponent implements Component {
  private sub?: Subscription;

  constructor(
    private readonly damageMultiplier: number | (() => number),
    private readonly attackType: AttackType,
    private readonly tooltip = ''
  ) {}

  description(): string {
    const mult =
      typeof this.damageMultiplier == 'number'
        ? this.damageMultiplier
        : this.damageMultiplier();
    return `On attack, deal an additional |cffffcc00${Math.round(
      100 * mult
    )}%|r of the damage dealt as ${this.attackType.nameColored}. ${
      this.tooltip
    }`;
  }

  register(module: Module): void {
    const mult =
      typeof this.damageMultiplier == 'number'
        ? this.damageMultiplier
        : this.damageMultiplier();
    this.sub = module.subjectAttackDamage.subscribe((target, tower, info) => {
      dealDamageOnHit(
        tower.unit,
        target.unit,
        info.damage * mult,
        true,
        this.attackType
      );
    });
  }
  unregister(): void {
    this.sub?.unsubscribe();
  }
  towerStats(): TowerStats {
    return TowerStats.empty();
  }
}

export class CountTowersWithModuleComponent implements Component {
  private subscriptions: Subscription[] = [];

  private _count = 0;
  get count() {
    return this._count;
  }
  private subject = new Subject<[count: number]>();
  readonly eventChange: Event<[count: number]> = this.subject;

  constructor(
    private readonly uniqueItemId?: ItemId,
    private readonly tooltip = ''
  ) {}

  register(module: Module): void {
    const subAdd = module.subjectOnAdd.subscribe(tower => {
      if (this.uniqueItemId) {
        const id = this.uniqueItemId;
        const count = tower.unit.items.filter(i => i.typeId.equals(id));
        if (count.length > 1) {
          return;
        }
      }
      this._count++;
      this.subject.emit(this.count);
    });
    const subRemove = module.subjectOnRemove.subscribe(tower => {
      if (this.uniqueItemId) {
        const id = this.uniqueItemId;
        const count = tower.unit.items.filter(i => i.typeId.equals(id));
        if (count.length > 1) {
          return;
        }
      }
      this._count--;
      this.subject.emit(this.count);
    });
    this.subscriptions.push(subRemove, subAdd);
  }
  unregister(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  description(): string {
    return this.tooltip;
  }
  towerStats(): TowerStats {
    return TowerStats.empty();
  }
}

export class TowerStatsComponet implements Component {
  constructor(
    private readonly stats: TowerStats | (() => TowerStats),
    private readonly tooltip: (stats: TowerStats) => string = () => ''
  ) {}
  register(module: Module): void {}
  unregister(): void {}
  description(): string {
    return this.tooltip(this.towerStats());
  }
  towerStats(): TowerStats {
    return this.stats instanceof TowerStats ? this.stats : this.stats();
  }
}
