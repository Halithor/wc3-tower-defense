import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit, dealDamageSpell} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Item, Subject} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';

const packHunterBonusDamage = 1;

const enrageCooldownReduction = 0.5;

const channelFeriocityDamagePerc = 0.2;

let packHunterTowers = 0;
const packHunterChangeSubject = new Subject<[]>();

export namespace Beast {
  export class PackHunter extends Module {
    static readonly itemId = itemId('I005');
    name = 'Pack Hunter';
    get description() {
      return `Gain +${packHunterBonusDamage} (${this.stats.damage}) damage for every other tower with this mod.`;
    }
    get stats(): TowerStats {
      return TowerStats.damage(
        Math.round(packHunterTowers * packHunterBonusDamage),
        0
      );
    }

    tower?: TowerInfo;

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
      this.tower = tower;

      packHunterChangeSubject.emit();
    }

    onRemove(_tower: TowerInfo) {
      print('remove pack hunter');
      this.tower = undefined;
      packHunterTowers -= 1;

      packHunterChangeSubject.emit();
    }
  }

  export class Enrage extends Module {
    static readonly itemId = itemId('I006');
    name = 'Enrage';
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
}
