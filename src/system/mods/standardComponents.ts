import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {DamageSource, dealDamageOnHit, eventAnyDamaging} from 'system/damage';
import {isUnitTower, TowerCategories} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {towerTracker} from 'system/towers/towertracker';
import {
  color,
  countUnitsInRect,
  Event,
  eventAnyUnitDamaged,
  eventUnitConstructionFinish,
  flashEffect,
  forUnitsInRange,
  ItemId,
  onAnyUnitConstructionFinish,
  randomAngle,
  standardTextTag,
  Subject,
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
      this.updateCount(this.count + 1);
    });
    const subRemove = module.eventOnRemove.subscribe(tower => {
      if (this.uniqueItemId) {
        const id = this.uniqueItemId;
        const count = tower.unit.items.filter(i => i.typeId.equals(id));
        if (count.length > 1) {
          return;
        }
      }
      this.updateCount(this.count - 1);
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
    private readonly tooltip:
      | ((stats: TowerStats) => string | string[])
      | undefined = undefined
  ) {}
  register(module: Module): void {}
  unregister(): void {}

  private statDesc(
    val: number,
    name: string,
    perc: boolean,
    wantPositive: boolean = true
  ) {
    const clr = (wantPositive ? val > 0 : val < 0)
      ? '|cffffcc00'
      : '|cffaa0000';
    return `${clr}${val > 0 ? '+' : ''}${val}${perc ? '%' : ''}|r ${name}.`;
  }

  private addDesc(
    desc: string[],
    val: number,
    name: string,
    perc: boolean,
    wantPositive: boolean = true
  ) {
    if (val != 0) {
      desc.push(this.statDesc(val, name, perc, wantPositive));
    }
  }

  description(): string | string[] {
    if (this.tooltip) {
      return this.tooltip(this.towerStats());
    }
    const st = this.towerStats();
    const desc: string[] = [];
    this.addDesc(desc, st.damage, 'damage', false);
    this.addDesc(desc, st.damagePerc, 'damage', true);
    this.addDesc(desc, st.range, 'range', false);
    this.addDesc(desc, st.rangePerc, 'range', true);
    this.addDesc(desc, st.cooldown, 'cooldown', false, false);
    this.addDesc(desc, st.cooldownPerc, 'attack speed', true);
    this.addDesc(desc, st.manaMax, 'mana', false);
    this.addDesc(desc, st.manaMaxPerc, 'mana', true);
    this.addDesc(desc, st.manaRegen, 'mana regen', false);
    this.addDesc(desc, st.manaRegenPerc, 'mana regen', true);
    return desc;
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
          this.updateCount(0);
        }
        this.incCount();
      }
    );
    const subRemove = module.eventOnRemove.subscribe(() => {
      this.target = undefined;
      this.updateCount(0);
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
    const tt = standardTextTag(
      tower.unit.pos.polarOffset(randomAngle(), 16),
      `+${mana}`
    );
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

export class DisableUniqueComponent implements Component {
  register(module: Module): void {}
  unregister(): void {}

  enableModule(module: Module): boolean {
    if (!module.tower) {
      return true;
    }
    const sames = module.tower.mods.modules.filter(
      mod => mod.constructor == module.constructor
    );
    if (sames[0] == module) {
      return true;
    }
    return false;
  }
  description(): string {
    return 'Limit 1 per tower.';
  }
}

// CountNearbyTowersComponent will count the number of nearby towers. Can be configured to include
// or exclude the holding tower, filter the towers in range, and trigger on more than the standard
// events. Normally recounts on add/remove of the given module and on tower build/destroy.
export class CountNearbyTowersComponent
  extends CountingEventComponent
  implements Component {
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly range: number,
    private readonly excludeHoldingTower: boolean = true,
    private readonly filter?: (u: TowerInfo) => boolean,
    private readonly otherEvents: Event<any>[] = []
  ) {
    super();
  }

  register(module: Module): void {
    this.subscriptions.push(
      module.eventOnAdd.subscribe(() => this.countTowers(module))
    );
    this.subscriptions.push(
      module.eventOnRemove.subscribe(() => this.updateCount(0))
    );
    this.subscriptions.push(
      eventUnitConstructionFinish.subscribe(() => this.countTowers(module))
    );
    this.subscriptions.push(
      towerTracker.eventRemoveTower.subscribe(() => this.countTowers(module))
    );
    this.otherEvents.forEach(event => {
      this.subscriptions.push(event.subscribe(() => this.countTowers(module)));
    });
  }
  unregister(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private countTowers(module: Module) {
    const tower = module.tower;
    if (!tower) {
      return;
    }
    let cnt = 0;
    forUnitsInRange(tower.unit.pos, this.range, u => {
      const countingTower = towerTracker.getTower(u);
      if (!countingTower) {
        return;
      }
      if (this.excludeHoldingTower && u.isUnit(tower.unit)) {
        return;
      }
      if (!this.filter || this.filter(countingTower)) {
        cnt++;
      }
    });
    this.updateCount(cnt);
  }
}

// EmitOnAddRemoveComponent takes a subject and emits on the subject whenever the module is added
// or removed from a tower.
export class EmitOnAddRemoveComponent implements Component {
  private subscriptions: Subscription[] = [];

  constructor(private readonly subject: Subject<[]>) {}

  register(module: Module): void {
    this.subscriptions.push(
      module.eventOnAdd.subscribe(() => this.subject.emit())
    );
    this.subscriptions.push(
      module.eventOnRemove.subscribe(() => this.subject.emit())
    );
  }
  unregister(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
