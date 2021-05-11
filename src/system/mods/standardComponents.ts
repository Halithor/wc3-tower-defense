import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {DamageSource, dealDamageOnHit} from 'system/damage';
import {TowerCategories} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {
  color,
  Event,
  flashEffect,
  ItemId,
  standardTextTag,
  Subscription,
} from 'w3lib/src/index';
import {
  Component,
  CountingEventComponent,
  ModDamageInfo,
  Module,
} from './module';

export class UpdateOnEventComponent implements Component {
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

export class DamageMultComponent implements Component {
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly sources: DamageSource[],
    private readonly multiplier: number | (() => number),
    private readonly attackType: AttackType,
    private readonly tooltip = ''
  ) {}

  description(): string {
    const onAttack = this.sources.indexOf(DamageSource.Attack) > -1;
    const onSpell = this.sources.indexOf(DamageSource.Spell) > -1;
    let onTip = '';
    if (onAttack && onSpell) {
      onTip = 'On attack or spell damage';
    } else if (onAttack) {
      onTip = 'On attack damage';
    } else if (onSpell) {
      onTip = 'On spell damage';
    }
    const mult =
      typeof this.multiplier == 'number' ? this.multiplier : this.multiplier();
    return `${onTip}, deal an additional |cffffcc00${Math.round(
      100 * mult
    )}%|r of the damage dealt as ${this.attackType.nameColored} damage. ${
      this.tooltip
    }`;
  }

  register(module: Module): void {
    const filtered = this.sources.filter(
      source => source == DamageSource.Attack || source == DamageSource.Spell
    ) as (DamageSource.Attack | DamageSource.Spell)[];
    this.subscriptions = filtered.map(
      (source: DamageSource.Attack | DamageSource.Spell) => {
        switch (source) {
          case DamageSource.Attack:
            return module.eventAttackDamage.subscribe((target, tower, info) =>
              this.dealDamage(target, tower, info)
            );
          case DamageSource.Spell:
            return module.eventSpellDamage.subscribe((target, tower, info) =>
              this.dealDamage(target, tower, info)
            );
        }
      }
    );
  }

  unregister(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  towerStats(): TowerStats {
    return TowerStats.empty();
  }

  private dealDamage(creep: Creep, tower: TowerInfo, info: ModDamageInfo) {
    const mult =
      typeof this.multiplier == 'number' ? this.multiplier : this.multiplier();
    dealDamageOnHit(
      tower.unit,
      creep.unit,
      info.damage * mult,
      true,
      this.attackType
    );
  }
}

export class DamageFlatComponent implements Component {
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly sources: DamageSource[],
    private readonly damage: number | (() => number),
    private readonly attackType: AttackType,
    private readonly extraTooltip = ''
  ) {}
  register(module: Module): void {
    const filtered = this.sources.filter(
      source => source == DamageSource.Attack || source == DamageSource.Spell
    ) as (DamageSource.Attack | DamageSource.Spell)[];
    this.subscriptions = filtered.map(
      (source: DamageSource.Attack | DamageSource.Spell) => {
        switch (source) {
          case DamageSource.Attack:
            return module.eventAttackDamage.subscribe((target, tower, info) =>
              this.dealDamage(target, tower, info)
            );
          case DamageSource.Spell:
            return module.eventSpellDamage.subscribe((target, tower, info) =>
              this.dealDamage(target, tower, info)
            );
        }
      }
    );
  }
  unregister(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  description(): string {
    const onAttack = this.sources.indexOf(DamageSource.Attack) > -1;
    const onSpell = this.sources.indexOf(DamageSource.Spell) > -1;
    let onTip = '';
    if (onAttack && onSpell) {
      onTip = 'On attack or spell damage';
    } else if (onAttack) {
      onTip = 'On attack damage';
    } else if (onSpell) {
      onTip = 'On spell damage';
    }
    const dmg = typeof this.damage == 'number' ? this.damage : this.damage();
    return `${onTip}, deal an additional |cffffcc00${dmg}|r ${this.attackType.nameColored} damage. ${this.extraTooltip}`;
  }
  towerStats(): TowerStats {
    return TowerStats.empty();
  }
  private dealDamage(creep: Creep, tower: TowerInfo, info: ModDamageInfo) {
    const dmg = typeof this.damage == 'number' ? this.damage : this.damage();
    dealDamageOnHit(tower.unit, creep.unit, dmg, true, this.attackType);
  }
}

export class CountTowersWithModuleComponent
  extends CountingEventComponent
  implements Component {
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly uniqueItemId?: ItemId,
    private readonly tooltip = ''
  ) {
    super();
  }

  register(module: Module): void {
    const subAdd = module.eventOnAdd.subscribe(tower => {
      if (this.uniqueItemId) {
        const id = this.uniqueItemId;
        const count = tower.unit.items.filter(i => i.typeId.equals(id));
        if (count.length > 1) {
          return;
        }
      }
      this.setCount(this.count + 1);
    });
    const subRemove = module.eventOnRemove.subscribe(tower => {
      if (this.uniqueItemId) {
        const id = this.uniqueItemId;
        const count = tower.unit.items.filter(i => i.typeId.equals(id));
        if (count.length > 1) {
          return;
        }
      }
      this.setCount(this.count - 1);
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

export class TowerStatsComponent implements Component {
  constructor(
    private readonly stats: TowerStats | (() => TowerStats),
    private readonly tooltip: (stats: TowerStats) => string | string[] = () =>
      ''
  ) {}
  register(module: Module): void {}
  unregister(): void {}
  description(): string | string[] {
    return this.tooltip(this.towerStats());
  }
  towerStats(): TowerStats {
    return this.stats instanceof TowerStats ? this.stats : this.stats();
  }
}

export class KillCountingComponent
  extends CountingEventComponent
  implements Component {
  private subscription?: Subscription;

  register(module: Module): void {
    this.subscription = module.eventOnKill.subscribe(() => {
      this.incCount();
    });
  }
  unregister(): void {
    this.subscription?.unsubscribe();
  }
  description(): string {
    return '';
  }
  towerStats(): TowerStats {
    return TowerStats.empty();
  }
}

export class ConsecutiveAttackCounter
  extends CountingEventComponent
  implements Component {
  private subscriptions: Subscription[] = [];
  private target?: Creep;

  register(module: Module): void {
    const subAttack = module.eventAttackDamage.subscribe(
      (creep, tower, info) => {
        if (!this.target || this.target != creep) {
          this.target = creep;
          this.setCount(0);
        }
        this.incCount();
      }
    );
    const subRemove = module.eventOnRemove.subscribe(() => {
      this.target = undefined;
      this.setCount(0);
    });
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

export class RestoreManaComponent implements Component {
  private subscriptions: Subscription[] = [];
  constructor(
    private readonly onAttack: boolean,
    private readonly onSpell: boolean,
    private readonly restoreAmount: number | (() => number)
  ) {}

  register(module: Module): void {
    if (this.onAttack) {
      this.subscriptions.push(
        module.eventOnAttack.subscribe((creep, tower) => {
          this.restoreMana(tower);
        })
      );
    }
    if (this.onSpell) {
      this.subscriptions.push(
        module.eventOnSpell.subscribe(tower => {
          this.restoreMana(tower);
        })
      );
    }
  }

  private restoreMana(tower: TowerInfo) {
    const mana =
      typeof this.restoreAmount == 'number'
        ? this.restoreAmount
        : this.restoreAmount();
    tower.unit.mana += mana;
    flashEffect(
      'Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl',
      tower.unit.pos
    );
    const tt = standardTextTag(tower.unit.pos, `+${mana}`);
    tt.color = color(0x1e, 0x90, 0xff);
  }
  unregister(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  description(): string | string[] {
    const mana =
      typeof this.restoreAmount == 'number'
        ? this.restoreAmount
        : this.restoreAmount();
    let onTip = '';
    if (this.onAttack && this.onSpell) {
      onTip = 'On attack or spell cast';
    } else if (this.onAttack) {
      onTip = 'On attack';
    } else if (this.onSpell) {
      onTip = 'On spell cast';
    }
    return `${onTip}, restore |cffffcc00${mana}|r mana.`;
  }
  towerStats(): TowerStats {
    return TowerStats.empty();
  }
}

export class DisableModByCategoryComponent implements Component {
  private tower?: TowerInfo;
  private cachedEnabled: boolean = true;
  private desc: string;
  constructor(
    private readonly enabledFor: TowerCategories[],
    private readonly disabledFor: TowerCategories[]
  ) {
    // Cache the description to avoid recomputing
    let enabled = '';
    this.enabledFor.forEach((val, idx) => {
      if (enabled.length > 0) {
        enabled += ', ';
        if (this.enabledFor.length > 2 && idx == this.enabledFor.length - 1) {
          enabled += 'and ';
        }
      }
      enabled += val;
    });
    let disabled = '';
    this.disabledFor.forEach((val, idx) => {
      if (disabled.length > 0) {
        disabled += ', ';
        if (this.disabledFor.length > 2 && idx == this.disabledFor.length - 1) {
          disabled += 'and ';
        }
      }
      disabled += val;
    });
    this.desc =
      (enabled.length > 0 ? `Only works in ${enabled} towers. ` : '') +
      (disabled.length > 0 ? `Disabled for ${disabled} towers.` : '');
  }
  register(module: Module): void {}
  unregister(): void {}

  enableModule(module: Module): boolean {
    // TODO Optimize this to cache the value until tower change
    if (!module.tower) {
      this.tower = undefined;
      return true;
    }
    if (this.tower != module.tower) {
      this.tower = module.tower;
      this.cachedEnabled = this.calculateEnabled(module.tower);
    }
    return this.cachedEnabled;
  }

  description(): string {
    return this.desc;
  }

  private calculateEnabled(tower: TowerInfo): boolean {
    const cats = tower.categories;
    // isEnabled or is enabled empty
    const inEnabled =
      cats.filter(cat => this.enabledFor.indexOf(cat) > -1).length > 0;
    const inDisabled =
      cats.filter(cat => this.disabledFor.indexOf(cat) > -1).length > 0;
    const result =
      (this.enabledFor.length == 0 || inEnabled) &&
      (this.disabledFor.length == 0 || !inDisabled);
    return result;
  }
}
