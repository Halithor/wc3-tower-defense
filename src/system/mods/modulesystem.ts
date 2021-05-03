import {
  eventAnyDamaging,
  eventAttackDamaging,
  eventOnHitDamaging,
  eventSpellDamaging,
  eventSpellOrAttackDamaging,
} from 'system/damage';
import {isUnitTower} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerTracker} from 'system/towers/towertracker';
import {
  doAfter,
  eventUnitAcquiresItem,
  eventUnitLosesItem,
  Item,
  Unit,
} from 'w3lib/src/index';

export class ModuleSystem {
  constructor(private readonly towerTracker: TowerTracker) {
    this.setupItemChanges();
    this.setupDamageEvents();
  }

  private setupDamageEvents() {
    eventAttackDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      if (!towerInfo) {
        return;
      }
      towerInfo.mods.modules().forEach(mod => {
        if (mod.handlers.onAttackDamage) {
          mod.handlers.onAttackDamage(target, towerInfo, info);
        }
      });
    });
    eventSpellDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      if (!towerInfo) {
        return;
      }
      towerInfo.mods.modules().forEach(mod => {
        if (mod.handlers.onSpellDamage) {
          mod.handlers.onSpellDamage(target, towerInfo, info);
        }
      });
    });
    eventSpellOrAttackDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      if (!towerInfo) {
        return;
      }
      towerInfo.mods.modules().forEach(mod => {
        if (mod.handlers.onSpellOrAttackDamage) {
          mod.handlers.onSpellOrAttackDamage(target, towerInfo, info);
        }
      });
    });
    eventOnHitDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      if (!towerInfo) {
        return;
      }
      towerInfo.mods.modules().forEach(mod => {
        if (mod.handlers.onOnHitDamage) {
          mod.handlers.onOnHitDamage(target, towerInfo, info);
        }
      });
    });
    eventAnyDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      if (!towerInfo) {
        return;
      }
      towerInfo.mods.modules().forEach(mod => {
        if (mod.handlers.onAnyDamage) {
          mod.handlers.onAnyDamage(target, towerInfo, info);
        }
      });
    });
  }

  private setupItemChanges() {
    eventUnitAcquiresItem.subscribe((u, i) => {
      this.onItemChange(u, i);
    });
    eventUnitLosesItem.subscribe((u, i) => {
      doAfter(0, () => this.onItemChange(u, i));
    });
  }

  private onItemChange(u: Unit, i: Item) {
    const info = this.towerTracker.getTower(u);
    if (!info) {
      return;
    }
    info.mods.change.fire();
  }
}
