import {AttackType, DefenseType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {doAfter, Event, Item, Subject} from 'w3lib/src/index';

export type ModDamageInfo = {
  damage: number;
  attackType: AttackType;
  targetDefenseType: DefenseType;
  damageType: damagetype;
  weaponType: weapontype;
  isSpell: boolean;
  isMeleeAttack: boolean;
  isRangedAttack: boolean;
};

export abstract class Module {
  abstract readonly components: Component[];

  // The tower that currently holds this module. Can be undefined if not held.
  tower?: TowerInfo;

  abstract readonly name: string;
  get stats(): TowerStats {
    if (!this.enabled) {
      return TowerStats.empty();
    }
    return this.components.reduce(
      (acc, comp) => (comp.towerStats ? acc.merge(comp.towerStats()) : acc),
      TowerStats.empty()
    );
  }
  get description(): string {
    return '';
  }

  get enabled(): boolean {
    const result = this.components.reduce((acc, comp) => {
      if (comp.enableModule) {
        return acc && comp.enableModule(this);
      }
      return acc;
    }, true);
    return result;
  }

  readonly subjectOnAdd = new Subject<[tower: TowerInfo]>();
  readonly eventOnAdd = this.subjectOnAdd.filter(() => this.enabled);
  readonly subjectOnRemove = new Subject<[tower: TowerInfo]>();
  readonly eventOnRemove = this.subjectOnRemove.filter(() => this.enabled);
  readonly subjectOnAttack = new Subject<[target: Creep, tower: TowerInfo]>();
  readonly eventOnAttack = this.subjectOnAttack.filter(() => this.enabled);
  readonly subjectOnKill = new Subject<[target: Creep, tower: TowerInfo]>();
  readonly eventOnKill = this.subjectOnKill.filter(() => this.enabled);
  readonly subjectOnSpell = new Subject<[tower: TowerInfo]>();
  readonly eventOnSpell = this.subjectOnSpell.filter(() => this.enabled);
  readonly subjectAttackDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly eventAttackDamage = this.subjectAttackDamage.filter(
    () => this.enabled
  );
  readonly subjectSpellDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly eventSpellDamage = this.subjectSpellDamage.filter(
    () => this.enabled
  );
  readonly subjectAttackOrSpellDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly eventAttackOrSpellDamage = this.subjectAttackOrSpellDamage.filter(
    () => this.enabled
  );
  readonly subjectOnHitDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly eventOnHitDamage = this.subjectOnHitDamage.filter(
    () => this.enabled
  );
  readonly subjectAnyDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly eventAnyDamage = this.subjectAnyDamage.filter(() => this.enabled);

  constructor(readonly item: Item) {
    doAfter(0, () => this.updateTooltip());
  }

  registerComponents() {
    this.components.forEach(comp => comp.register(this));
  }

  destroy() {
    this.components.forEach(comp => comp.unregister());
  }

  updateTooltip() {
    let tt = this.description;
    if (!this.enabled) {
      tt = `|cffcc0000DISABLED|r${tt.length > 0 ? '|n' : ''}${tt}`;
    }
    let bonuses = '';
    this.components.forEach(comp => {
      const desc = comp.description ? comp.description() : '';
      if (typeof desc == 'string') {
        if (desc != '') {
          bonuses += `• ${desc}|n`;
        }
      } else {
        desc.forEach(val => {
          bonuses += `• ${val}|n`;
        });
      }
    });
    if (bonuses.length > 0) {
      if (tt.length > 0) {
        tt += '|n|n';
      }
      tt += `|cff6699ffEffects:|r|n${bonuses.substr(0, bonuses.length - 2)}`;
    }
    this.item.tooltipExtended = tt;
  }
}

export interface Component {
  register(module: Module): void;
  unregister(): void;

  description?(): string | string[];
  towerStats?(): TowerStats;

  enableModule?(module: Module): boolean;
}

export class EventComponent<T extends any[]> {
  protected readonly subject = new Subject<T>();
  readonly event: Event<T> = this.subject;
}

export class CountingEventComponent extends EventComponent<[count: number]> {
  private _count = 0;

  get count(): number {
    return this._count;
  }
  protected setCount(val: number) {
    this._count = val;
    this.subject.emit(this.count);
  }
  protected incCount() {
    this._count++;
    this.subject.emit(this.count);
  }
  protected decCount() {
    this._count--;
    this.subject.emit(this.count);
  }
}
