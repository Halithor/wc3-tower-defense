import {AttackType, DefenseType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {doAfter, Item, Subject} from 'w3lib/src/index';

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
    return this.components.reduce(
      (acc, comp) => acc.merge(comp.towerStats()),
      TowerStats.empty()
    );
  }
  get description(): string {
    return '';
  }

  readonly subjectOnAdd = new Subject<[tower: TowerInfo]>();
  readonly subjectOnRemove = new Subject<[tower: TowerInfo]>();
  readonly subjectOnAttack = new Subject<[target: Creep, tower: TowerInfo]>();
  readonly subjectOnKill = new Subject<[target: Creep, tower: TowerInfo]>();
  readonly subjectOnSpell = new Subject<[tower: TowerInfo]>();
  readonly subjectAttackDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly subjectSpellDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly subjectAttackOrSpellDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly subjectOnHitDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();
  readonly subjectAnyDamage = new Subject<
    [target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo]
  >();

  constructor(readonly item: Item) {
    doAfter(0, () => this.updateTooltip());
  }

  registerComponents() {
    this.components.forEach(comp => comp.register(this));
  }

  destroy() {
    this.components.forEach(comp => comp.unregister());
  }

  onAdd(tower: TowerInfo) {}
  onRemove(tower: TowerInfo) {}

  onAttack(target: Creep, tower: TowerInfo) {}

  onKill(target: Creep, tower: TowerInfo) {}

  onSpell(tower: TowerInfo) {}

  onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}
  onSpellDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}
  onSpellOrAttackDamage(
    target: Creep,
    tower: TowerInfo,
    damageInfo: ModDamageInfo
  ) {}
  onOnHitDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}
  onAnyDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {}

  updateTooltip() {
    let tt = this.description;
    let bonuses = '';
    this.components.forEach(comp => {
      const desc = comp.description();
      if (desc != '') {
        bonuses += `• ${desc}|n`;
      }
    });
    if (bonuses.length > 0) {
      if (tt.length > 0) {
        tt += '|n|n';
      }
      tt += `|cff6699ffBonuses:|r|n${bonuses.substr(0, bonuses.length - 2)}`;
    }
    this.item.tooltipExtended = tt;
  }
}

export interface Component {
  register(module: Module): void;
  unregister(): void;

  description(): string;
  towerStats(): TowerStats;
}
