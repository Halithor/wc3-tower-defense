import {AttackType} from 'combattypes';
import {
  Subject,
  onAnyUnitConstructionFinish,
  onAnyUnitDeath,
  onAnyUnitUpgradeFinish,
  Unit,
  Event,
} from 'w3lib/src/index';
import {baseTowerStats, isUnitTower, towerGoldValue} from './towerconstants';
import {TowerInfo} from './towerinfo';

// TowerTracker tracks the association of TowerInfos with a given unit
class TowerTracker {
  readonly eventNewTower = new Subject<[info: TowerInfo]>();
  private readonly subjectRemoveTower = new Subject<[info: TowerInfo]>();
  readonly eventRemoveTower: Event<[info: TowerInfo]> = this.subjectRemoveTower;

  private towers: {[key: number]: TowerInfo} = {};

  setup() {
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
    this.eventNewTower.emit(info);
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
    this.eventNewTower.emit(info);
  }

  addTower(info: TowerInfo) {
    this.towers[info.unit.id] = info;
  }

  getTower(unit: Unit): TowerInfo | undefined {
    return this.towers[unit.id];
  }

  removeTower(unit: Unit) {
    if (unit.id in this.towers) {
      this.subjectRemoveTower.emit(this.towers[unit.id]);
      delete this.towers[unit.id];
    }
  }
}

export const towerTracker = new TowerTracker();
