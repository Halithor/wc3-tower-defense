import {AttackType, DefenseType} from 'combattypes';
import {creepTracker} from 'system/creeps/creeptracker';
import {
  eventAnyDamaging,
  eventAttackDamaging,
  eventOnHitDamaging,
  eventSpellDamaging,
  eventSpellOrAttackDamaging,
} from 'system/damage';
import {eventTowerSpell} from 'system/towers/spelltowers';
import {TowerInfo} from 'system/towers/towerinfo';
import {towerTracker} from 'system/towers/towertracker';
import {
  DamageInfo,
  doAfter,
  eventAnyUnitDeath,
  eventUnitAcquiresItem,
  eventUnitAttacked,
  eventUnitLosesItem,
  eventUnitSellsItemFromShop,
  Item,
  Unit,
} from 'w3lib/src/index';
import {Arcane} from './arcane';
import {Beast} from './beast';
import {Blood} from './blood';
import {Holy} from './church';
import {Demon} from './demon';
import {ModDamageInfo, Module} from './module';
import {moduleTracker} from './moduleTracker';
import {Necro} from './necro';
import {Tech} from './tech';

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
  constructor() {
    this.setupItemChanges();
    this.setupDamageEvents();
  }

  private setupDamageEvents() {
    eventAttackDamaging.subscribe((target, attacker, info) => {
      const towerInfo = towerTracker.getTower(attacker);
      const creepInfo = creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      const converted = convertInfo(info, target);
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectAttackDamage.emit(creepInfo, towerInfo, converted);
      });
    });
    eventSpellDamaging.subscribe((target, attacker, info) => {
      const towerInfo = towerTracker.getTower(attacker);
      const creepInfo = creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      const converted = convertInfo(info, target);
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectSpellDamage.emit(creepInfo, towerInfo, converted);
      });
    });
    eventSpellOrAttackDamaging.subscribe((target, attacker, info) => {
      const towerInfo = towerTracker.getTower(attacker);
      const creepInfo = creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      const converted = convertInfo(info, target);
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectAttackOrSpellDamage.emit(creepInfo, towerInfo, converted);
      });
    });
    eventOnHitDamaging.subscribe((target, attacker, info) => {
      const towerInfo = towerTracker.getTower(attacker);
      const creepInfo = creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      const converted = convertInfo(info, target);
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectOnHitDamage.emit(creepInfo, towerInfo, converted);
      });
    });
    eventAnyDamaging.subscribe((target, attacker, info) => {
      const towerInfo = towerTracker.getTower(attacker);
      const creepInfo = creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      const converted = convertInfo(info, target);
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectAnyDamage.emit(creepInfo, towerInfo, converted);
      });
    });
    eventTowerSpell.subscribe(towerInfo => {
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectOnSpell.emit(towerInfo);
      });
    });
    eventUnitAttacked.subscribe((target, attacker) => {
      const towerInfo = towerTracker.getTower(attacker);
      const creepInfo = creepTracker.getCreep(target);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectOnAttack.emit(creepInfo, towerInfo);
      });
    });
    eventAnyUnitDeath.subscribe((dying, killer) => {
      if (!killer) {
        return;
      }
      const towerInfo = towerTracker.getTower(killer);
      const creepInfo = creepTracker.getCreep(dying);
      if (!towerInfo || !creepInfo) {
        return;
      }
      towerInfo.mods.modules.forEach(mod => {
        mod.subjectOnKill.emit(creepInfo, towerInfo);
      });
    });
  }

  private setupItemChanges() {
    eventUnitAcquiresItem.subscribe((u, i) => {
      const tower = towerTracker.getTower(u);
      const mod = moduleTracker.get(i);
      this.onItemChange(tower, mod, true);
    });
    eventUnitLosesItem.subscribe((u, i) => {
      const tower = towerTracker.getTower(u);
      const mod = moduleTracker.get(i);
      doAfter(0, () => this.onItemChange(tower, mod, false));
    });
    eventUnitSellsItemFromShop.subscribe((shop, purchaser, i) => {
      this.onItemSoldShop(i);
    });
  }

  private onItemChange(
    tower: TowerInfo | undefined,
    mod: Module | undefined,
    acquisition: boolean
  ) {
    if (mod && tower) {
      if (acquisition) {
        mod.tower = tower;
        mod.subjectOnAdd.emit(tower);
      } else {
        if (mod.tower == tower) {
          // if equivalent, it means that an add event hasn't overwritten and
          // is therefore not in another tower.
          mod.tower = undefined;
        }
        mod.subjectOnRemove.emit(tower);
      }
      mod.updateTooltip();
    }
    if (tower) {
      tower.mods.change.emit();
    }
  }

  private onItemSoldShop(i: Item) {
    const mod = makeModule(i);
    mod.registerComponents();
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
    case Demon.Immolation.itemId.value:
      return new Demon.Immolation(item);
    case Beast.PackHunter.itemId.value:
      return new Beast.PackHunter(item);
    case Beast.Enrage.itemId.value:
      return new Beast.Enrage(item);
    case Beast.ChannelFerocity.itemId.value:
      return new Beast.ChannelFerocity(item);
    case Beast.SharpenedClaws.itemId.value:
      return new Beast.SharpenedClaws(item);
    case Necro.Necromancer.itemId.value:
      return new Necro.Necromancer(item);
    case Necro.SoulBattery.itemId.value:
      return new Necro.SoulBattery(item);
    case Blood.BloodFrenzy.itemId.value:
      return new Blood.BloodFrenzy(item);
    case Blood.DarkRitual.itemId.value:
      return new Blood.DarkRitual(item);
    case Holy.Priesthood.itemId.value:
      return new Holy.Priesthood(item);
    case Holy.Bishop.itemId.value:
      return new Holy.Bishop(item);
    case Holy.Archbishop.itemId.value:
      return new Holy.Archbishop(item);
    case Tech.CrystalScope.itemId.value:
      return new Tech.CrystalScope(item);
    case Tech.LongRangeTargetingSystem.itemId.value:
      return new Tech.LongRangeTargetingSystem(item);
    case Tech.WiredConnection.itemId.value:
      return new Tech.WiredConnection(item);
  }
  return new NullModule(item);
}

class NullModule extends Module {
  name = 'Null Module';
  components = [];
}
