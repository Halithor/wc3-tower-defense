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
  eventAnyUnitDeath,
  eventUnitAcquiresItem,
  eventUnitLosesItem,
  eventUnitSellsItemFromShop,
  Item,
  Unit,
} from 'w3lib/src/index';
import {Arcane} from './arcane';
import {Beast} from './beast';
import {Demon} from './demon';
import {ModDamageInfo, Module} from './module';
import {moduleTracker} from './moduleTracker';
import {Necro} from './necro';

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
    eventAnyUnitDeath.subscribe((dying, killer) => {
      if (!killer) {
        return;
      }
      const towerInfo = this.towerTracker.getTower(killer);
      const creepInfo = this.creepTracker.getCreep(dying);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.onKill(creepInfo, towerInfo);
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
    const tower = this.towerTracker.getTower(u);
    const mod = moduleTracker.get(i);
    if (mod && tower) {
      if (acquisition) {
        mod.tower = tower;
        mod.onAdd(tower);
      } else {
        if (mod.tower == tower) {
          // if equivalent, it means that an add event hasn't overwritten and
          // is therefore not in another tower.
          mod.tower = undefined;
        }
        mod.onRemove(tower);
      }
      mod.updateTooltip();
    }
    if (tower) {
      tower.mods.change.emit();
    }
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
    case Demon.DemonFire.itemId.value:
      return new Demon.DemonFire(item);
    case Demon.DemonFrost.itemId.value:
      return new Demon.DemonFrost(item);
    case Beast.PackHunter.itemId.value:
      return new Beast.PackHunter(item);
    case Beast.Enrage.itemId.value:
      return new Beast.Enrage(item);
    case Beast.ChannelFeriocity.itemId.value:
      return new Beast.ChannelFeriocity(item);
    case Beast.SharpenedClaws.itemId.value:
      return new Beast.SharpenedClaws(item);
    case Necro.Necromancer.itemId.value:
      return new Necro.Necromancer(item);
    case Necro.SoulBattery.itemId.value:
      return new Necro.SoulBattery(item);
  }
  return new NullModule(item);
}

class NullModule extends Module {
  name = 'Null Module';
  description = '';
  stats = TowerStats.empty();
}
