import {AttackType} from 'combattypes';
import {
  Event,
  onAnyUnitConstructionFinish,
  onAnyUnitDeath,
  onAnyUnitUpgradeFinish,
  Unit,
} from 'w3lib/src/index';
import {baseTowerStats, isUnitTower, towerGoldValue} from './towerconstants';
import {TowerInfo} from './towerinfo';

// TowerTracker tracks the association of TowerInfos with a given unit
export class TowerTracker {
  readonly eventNewTower: Event<[info: TowerInfo]>;
  private towers: {[key: number]: TowerInfo} = {};
  constructor() {
    this.eventNewTower = new Event<[info: TowerInfo]>();

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
  }

  private onConstruction(tower: Unit) {
    const baseStats = baseTowerStats(tower.typeId);
    const info = new TowerInfo(tower, baseStats, towerGoldValue(tower.typeId));
    this.addTower(info);
    this.eventNewTower.fire(info);
  }

  private onUpgrade(tower: Unit) {
    const prevInfo = this.getTower(tower);
    this.removeTower(tower);
    const baseStats = baseTowerStats(tower.typeId);
    const info = new TowerInfo(tower, baseStats, towerGoldValue(tower.typeId));
    if (prevInfo) {
      prevInfo.moveInfoTo(info);
    }
    this.addTower(info);
    this.eventNewTower.fire(info);
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
