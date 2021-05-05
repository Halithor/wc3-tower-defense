import {AttackType, DefenseType} from 'combattypes';
import {CreepTracker} from 'system/creeps/creeptracker';
import {
  eventAnyDamaging,
  eventAttackDamaging,
  eventOnHitDamaging,
  eventSpellDamaging,
  eventSpellOrAttackDamaging,
} from 'system/damage';
import {eventTowerSpell} from 'system/towers/spelltowers';
import {TowerStats} from 'system/towers/towerstats';
import {TowerTracker} from 'system/towers/towertracker';
import {
  DamageInfo,
  doAfter,
  eventUnitAcquiresItem,
  eventUnitLosesItem,
  eventUnitSellsItemFromShop,
  Item,
  Unit,
} from 'w3lib/src/index';
import {Arcane} from './arcane';
import {ModDamageInfo, Module} from './module';
import {moduleTracker} from './moduleTracker';

function convertInfo(info: DamageInfo, target: Unit): ModDamageInfo {
  return {
    ...info,
    attackType: AttackType.invert(info.attackType),
    targetDefenseType: DefenseType.invert(
      ConvertDefenseType(target.getIntegerField(UNIT_IF_DEFENSE_TYPE))
    ),
  };
}

export class ModuleSystem {
  constructor(
    private readonly towerTracker: TowerTracker,
    private readonly creepTracker: CreepTracker
  ) {
    this.setupItemChanges();
    this.setupDamageEvents();
  }

  private setupDamageEvents() {
    eventAttackDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      const creepInfo = this.creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.onAttackDamage(creepInfo, towerInfo, convertInfo(info, target));
      });
    });
    eventSpellDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      const creepInfo = this.creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.onSpellDamage(creepInfo, towerInfo, convertInfo(info, target));
      });
    });
    eventSpellOrAttackDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      const creepInfo = this.creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.onSpellOrAttackDamage(
          creepInfo,
          towerInfo,
          convertInfo(info, target)
        );
      });
    });
    eventOnHitDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      const creepInfo = this.creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.onOnHitDamage(creepInfo, towerInfo, convertInfo(info, target));
      });
    });
    eventAnyDamaging.subscribe((target, attacker, info) => {
      const towerInfo = this.towerTracker.getTower(attacker);
      const creepInfo = this.creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.onAnyDamage(creepInfo, towerInfo, convertInfo(info, target));
      });
    });
    eventTowerSpell.subscribe(towerInfo => {
      towerInfo.mods.modules.forEach(mod => {
        mod.onSpell(towerInfo);
      });
    });
  }

  private setupItemChanges() {
    eventUnitAcquiresItem.subscribe((u, i) => {
      this.onItemChange(u, i, true);
    });
    eventUnitLosesItem.subscribe((u, i) => {
      doAfter(0, () => this.onItemChange(u, i, false));
    });
    eventUnitSellsItemFromShop.subscribe((shop, purchaser, i) => {
      this.onItemSoldShop(i);
    });
  }

  private onItemChange(u: Unit, i: Item, acquisition: boolean) {
    const info = this.towerTracker.getTower(u);
    if (!info) {
      return;
    }
    info.mods.change.emit();
    info.mods.modules.forEach(mod => {
      if (acquisition) {
        mod.onAdd(info);
      } else {
        mod.onRemove(info);
      }
    });
  }

  private onItemSoldShop(i: Item) {
    const mod = makeModule(i);
    moduleTracker.addModule(mod);
  }
}

export function makeModule(item: Item): Module {
  switch (item.typeId.value) {
    case Arcane.ScryingStone.itemId.value:
      return new Arcane.ScryingStone(item);
    case Arcane.ManaStone.itemId.value:
      return new Arcane.ManaStone(item);
    case Arcane.DiviningRod.itemId.value:
      return new Arcane.DiviningRod(item);
  }
  return new NullModule(item);
}

class NullModule extends Module {
  name = 'Null Module';
  description = '';
  stats = TowerStats.empty();
}
