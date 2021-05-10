import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerCategories} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {ModDamageInfo, Module} from './module';

const bloodFrenzyBonusPerAttack = 2;

const darkRitualSpeedDecrease = 2.0;
const darkRitualBonusDamagePerc = 100;

export namespace Blood {
  export class BloodFrenzy extends Module {
    static readonly itemId = itemId('I00B');
    name = 'Blood Frenzy';
    components = [];
    get description() {
      return `${
        this.tower && this.tower.categories.indexOf(TowerCategories.AoE) > -1
          ? '|cffcc0000DISABLED: |r'
          : ''
      }|cffaaaaaaSingle target only|r|nEvery consecutive attack on a creep does +2 additional curse damage.|n|cff6699ffBonuses:|r|n+${
        bloodFrenzyBonusPerAttack * this.attacks
      } ${AttackType.Cursed.nameColored} damage on attack.`;
    }
    get stats() {
      return TowerStats.empty();
    }

    private target?: Creep;
    private attacks = 0;

    onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      if (tower.categories.indexOf(TowerCategories.AoE) > -1) {
        this.attacks = 0;
        this.updateTooltip();
        return;
      }
      if (!this.target || this.target != target) {
        this.target = target;
        this.attacks = 0;
      }
      this.attacks++;
      dealDamageOnHit(
        tower.unit,
        target.unit,
        bloodFrenzyBonusPerAttack * this.attacks,
        true,
        AttackType.Cursed
      );
      this.updateTooltip();
    }

    onRemove() {
      this.target = undefined;
      this.attacks = 0;
    }
  }

  export class DarkRitual extends Module {
    static readonly itemId = itemId('I00C');
    name = 'Dark Ritual';
    components = [];

    get description() {
      return `|cff6699ffBonuses:|r|n+${darkRitualSpeedDecrease} attack cooldown|n+${darkRitualBonusDamagePerc}% damage`;
    }

    get stats() {
      return TowerStats.damage(0, darkRitualBonusDamagePerc).merge(
        TowerStats.attackSpeed(darkRitualSpeedDecrease, 0)
      );
    }
  }
}
