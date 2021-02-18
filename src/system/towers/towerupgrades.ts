import {UnitIds} from 'constants';
import {onAnyUnitTrainingFinish} from 'w3lib/src/index';
import {isUnitTower} from './towerconstants';
import {TowerStats} from './towerstats';
import {TowerTracker} from './towertracker';

const dmgUpgrade = TowerStats.damage(0, 20);
const spdUpgrade = TowerStats.attackSpeed(0, 20);

export class TowerUpgrades {
  constructor(tracker: TowerTracker) {
    onAnyUnitTrainingFinish((trained, tower) => {
      if (!isUnitTower(tower)) {
        return;
      }
      const info = tracker.getTower(tower);
      if (!info) {
        return;
      }
      let upgrade: TowerStats;
      if (trained.typeId.equals(UnitIds.upgradeDamage)) {
        upgrade = dmgUpgrade;
      } else if (trained.typeId.equals(UnitIds.upgradeSpeed)) {
        upgrade = spdUpgrade;
      } else {
        return;
      }
      info.addUpgradeStats(upgrade, 10);
    });
  }
}
