import {SpellIds} from 'constants';
import {
  onAnyUnitConstructionFinish,
  onAnyUnitUpgradeFinish,
} from 'w3lib/src/index';

export class TowerSystem {
  constructor() {
    this.removeRallyAbilityOnTowers();
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
