import {AttackType} from 'combattypes';
import {
  Group,
  onAnyUnitConstructionFinish,
  onAnyUnitDeath,
  onAnyUnitUpgradeFinish,
  onAnyUnitUpgradeStart,
  Players,
  Trigger,
  Unit,
} from 'w3lib/src/index';
import {baseTowerStats, isUnitTower, towerGoldValue} from './towerconstants';
import {TowerInfo} from './towerinfo';
import {TowerStats} from './towerstats';

// TowerTracker tracks the association of TowerInfos with a given unit
export class TowerTracker {
  private towers: {[key: number]: TowerInfo} = {};
  constructor() {
    onAnyUnitDeath(dying => {
      this.removeTower(dying);
    });
    onAnyUnitConstructionFinish(tower => {
      if (!isUnitTower(tower)) {
        return;
      }
      this.onConstruction(tower);
    });
    onAnyUnitUpgradeFinish(tower => {
      if (!isUnitTower(tower)) {
        return;
      }
      this.onUpgrade(tower);
    });
    const test = new Trigger();
    test.registerPlayerChatEvent(Players[0], '-range', false);
    test.addAction(() => {
      const selected = Group.fromHandle(GetUnitsSelectedAll(Players[0].handle));
      selected.for(() => {
        const u = Unit.fromHandle(GetEnumUnit());
        const info = this.getTower(u);
        if (info) {
          print(`adding 10% range to ${u.name}`);
          info.addStatMods(
            new TowerStats(AttackType.Whoknows, 0, 10, 0, 10, 0, 0)
          );
        }
      });
    });
  }

  private onConstruction(tower: Unit) {
    print(`${tower.name} onConstruction`);
    const baseStats = baseTowerStats(tower.typeId);
    this.addTower(
      new TowerInfo(tower, baseStats, towerGoldValue(tower.typeId))
    );
  }

  private onUpgrade(tower: Unit) {
    print(`${tower.name} onUpgrade`);
    const prev = this.getTower(tower);
    this.removeTower(tower);
    this.onConstruction(tower);
    const next = this.getTower(tower);

    if (!prev || !next) {
      return;
    }
    prev.upgradeInto(next);
  }

  addTower(info: TowerInfo) {
    this.towers[info.tower.id] = info;
  }

  getTower(unit: Unit): TowerInfo | undefined {
    if (unit.id in this.towers) {
      return this.towers[unit.id];
    }
    return undefined;
  }

  removeTower(unit: Unit) {
    if (unit.id in this.towers) {
      delete this.towers[unit.id];
    }
  }
}
