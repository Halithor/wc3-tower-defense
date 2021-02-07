import {SpellIds} from 'constants';
import {
  onAnyUnitConstructionFinish,
  onAnyUnitUpgradeFinish,
} from 'w3lib/src/index';
import {SpellTowerEffects} from './spelltowers';

export class TowerSystem {
  constructor() {
    this.removeRallyAbilityOnTowers();

    const spellTowerEffects = new SpellTowerEffects();
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
