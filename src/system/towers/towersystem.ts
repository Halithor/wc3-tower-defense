import {SpellIds} from 'constants';
import {CircleIndicator} from 'lib/indicator';
import {
  doAfter,
  onAnyUnitConstructionFinish,
  onAnyUnitSpellEffect,
  onAnyUnitUpgradeFinish,
} from 'w3lib/src/index';
import {SpellTowerEffects} from './spelltowers';
import {TowerSellingSystem} from './towerselling';
import {TowerTracker} from './towertracker';
import {TowerUpgrades} from './towerupgrades';

export class TowerSystem {
  constructor(readonly towerTracker: TowerTracker) {
    this.removeRallyAbilityOnTowers();

    const towerSelling = new TowerSellingSystem(towerTracker);
    const spellTowerEffects = new SpellTowerEffects();
    const towerUpgrades = new TowerUpgrades(towerTracker);

    onAnyUnitSpellEffect((caster, ability) => {
      if (!ability.equals(SpellIds.showTowerStats)) {
        return;
      }
      const info = towerTracker.getTower(caster);
      if (!info) {
        return;
      }
      DisplayTimedTextToPlayer(
        caster.owner.handle,
        0,
        0,
        10,
        `|cffffcc00${caster.name}'s Statistics:|r\n${info.stats.toString()}`
      );
      const range = caster.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0);
      const indicator = new CircleIndicator(
        caster.pos,
        range + 64,
        Math.round(6 + range / 32)
      );
      doAfter(4, () => indicator.remove());
    });
  }

  private removeRallyAbilityOnTowers() {
    onAnyUnitConstructionFinish(constructed => {
      if (constructed.isUnitType(UNIT_TYPE_STRUCTURE)) {
        constructed.removeAbility(SpellIds.setRally);
      }
    });
    onAnyUnitUpgradeFinish(upgraded => {
      if (upgraded.isUnitType(UNIT_TYPE_STRUCTURE)) {
        upgraded.removeAbility(SpellIds.setRally);
      }
    });
  }
}
