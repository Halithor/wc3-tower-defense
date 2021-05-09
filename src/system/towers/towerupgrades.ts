import {SpellIds, UnitIds} from 'constants';
import {
  onAnyUnitSellUnit,
  onAnyUnitTrainingFinish,
  UnitId,
} from 'w3lib/src/index';
import {isUnitTower} from './towerconstants';
import {TowerInfo} from './towerinfo';
import {TowerStats} from './towerstats';
import {TowerTracker} from './towertracker';

const dmgUpgrade = TowerStats.damage(0, 20);
const spdUpgrade = TowerStats.attackSpeed(0, 20);

const inventoryAbilities = [
  SpellIds.inventory1,
  SpellIds.inventory2,
  SpellIds.inventory3,
  SpellIds.inventory4,
  SpellIds.inventory5,
  SpellIds.inventory6,
];

export class TowerUpgrades {
  constructor(tracker: TowerTracker) {
    onAnyUnitSellUnit((sold, seller) => {
      const tower = tracker.getTower(seller);
      if (!tower) {
        return;
      }
      if (sold.typeId.equals(UnitIds.upgradeDamage)) {
        tower.addUpgradeStats(dmgUpgrade, 10);
      } else if (sold.typeId.equals(UnitIds.upgradeSpeed)) {
        tower.addUpgradeStats(spdUpgrade, 10);
      } else if (sold.typeId.equals(UnitIds.upgradeModules)) {
        this.increaseTowerModules(tower);
        tower.addUpgradeStats(TowerStats.empty(), 10);
      }
    });
  }

  private increaseTowerModules(tower: TowerInfo) {
    const curLevel = tower.unit.getAbilityLevel(SpellIds.inventoryUpg);
    if (curLevel >= 6) {
      return;
    }
    tower.unit.incAbilityLevel(SpellIds.inventoryUpg);
    if (curLevel == 5) {
      tower.unit.removeUnitFromStock(UnitIds.upgradeModules);
    }
  }
}
