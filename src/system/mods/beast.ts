import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit, dealDamageSpell} from 'system/damage';
import {
  isUnitTower,
  TowerCategories,
  towerCategories,
} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Item, Subject} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';

const packHunterBonusDamage = 1;

const enrageCooldownReduction = 0.5;

const channelFeriocityDamagePerc = 0.2;

const sharpenedClawsDamageBonus = 50;

let packHunterTowers = 0;
const packHunterChangeSubject = new Subject<[]>();

export namespace Beast {
  export class PackHunter extends Module {
    static readonly itemId = itemId('I005');
    name = 'Pack Hunter';
    components = [];
    get description() {
      return `Gain +${packHunterBonusDamage} damage for every tower with this mod.|n|cff6699ffBonuses:|r|n+${this.stats.damage} damage`;
    }
    get stats(): TowerStats {
      return TowerStats.damage(
        Math.round(packHunterTowers * packHunterBonusDamage),
        0
      );
    }

    constructor(item: Item) {
      super(item);

      packHunterChangeSubject.subscribe(() => {
        this.onPackChange();
      });
    }

    onPackChange() {
      if (!this.tower) {
        this.updateTooltip();
        return;
      }
      this.tower.mods.change.emit();
    }

    onAdd(tower: TowerInfo) {
      packHunterTowers += 1;

      packHunterChangeSubject.emit();
    }

    onRemove(_tower: TowerInfo) {
      packHunterTowers -= 1;

      packHunterChangeSubject.emit();
    }
  }

  export class Enrage extends Module {
    static readonly itemId = itemId('I006');
    name = 'Enrage';
    components = [];
    get description() {
      return `Reduce attack cooldown by ${enrageCooldownReduction} (minimum 0.1).`;
    }
    get stats() {
      return TowerStats.attackSpeed(-enrageCooldownReduction, 0);
    }
  }

  export class ChannelFeriocity extends Module {
    static readonly itemId = itemId('I007');
    name = 'Channel Ferocity';
    components = [];
    get stats() {
      return TowerStats.empty();
    }

    get description(): string {
      return `Deal an additional ${Math.round(
        100 * channelFeriocityDamagePerc
      )}% ${AttackType.Natural.nameColored} damage on spell damage.`;
    }

    onSpellDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      const dmg = damageInfo.damage * channelFeriocityDamagePerc;
      dealDamageOnHit(tower.unit, target.unit, dmg, true, AttackType.Natural);
    }
  }

  export class SharpenedClaws extends Module {
    static readonly itemId = itemId('I00A');
    name = 'Sharpened Claws';
    components = [];

    get description() {
      if (!this.tower) {
        return `|cffaaaaaaMelee only|r|n|cff6699ffBonuses:|r|n+ ${sharpenedClawsDamageBonus}% damage`;
      }
      const isMelee = this.tower.categories.indexOf(TowerCategories.Melee) >= 0;
      return `${
        !isMelee
          ? '|cffcc0000DISABLED: Melee only|r|n'
          : '|cffaaaaaaMelee only|r|n'
      }|cff6699ffBonuses:|r|n+${sharpenedClawsDamageBonus}% damage`;
    }

    get stats() {
      if (!this.tower) {
        return TowerStats.empty();
      }
      const cats = this.tower.categories;
      if (cats.indexOf(TowerCategories.Melee) >= 0) {
        return TowerStats.damage(0, sharpenedClawsDamageBonus);
      }
      return TowerStats.empty();
    }
  }
}
