import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {eventAnyUnitDeath, Item} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';

const necromancyKillsNeeded = 20;
const necromancyBonusMana = 5;
const necromancyBonusDamagePerc = 0.2;
const necromancyAttackType = AttackType.Cursed;

const soulBatteryRangeSq = 300 * 300;
const soulBatteryMaxBonus = 300;

export namespace Necro {
  export class Necromancer extends Module {
    static readonly itemId = itemId('I008');
    name = 'Necromancy';

    private completed = false;
    private kills = 0;

    get description(): string {
      if (this.completed) {
        return `|cff3399CCStatus:|r Training Completed\n|cff3399CCBonuses:|r|n+${necromancyBonusMana} max mana|n+${Math.round(
          100 * necromancyBonusDamagePerc
        )}% spell damage as ${necromancyAttackType.nameColored}.`;
      } else {
        return `|cff3399CCStatus:|r Need ${
          necromancyKillsNeeded - this.kills
        } kills to finish training.|n|cff3399CCAfter completion, will grant:|r|n+${necromancyBonusMana} max mana|n+${Math.round(
          100 * necromancyBonusDamagePerc
        )}% spell damage as ${necromancyAttackType.nameColored} damage.`;
      }
    }

    get stats(): TowerStats {
      if (this.completed) {
        return TowerStats.mana(necromancyBonusMana, 0);
      }
      return TowerStats.empty();
    }

    onKill(target: Creep, tower: TowerInfo) {
      this.kills++;
      if (this.kills >= necromancyKillsNeeded && !this.completed) {
        this.completed = true;
        tower.mods.change.emit();
      }
      if (!this.completed) {
        this.updateTooltip();
      }
    }

    onSpellDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      if (this.completed) {
        const dmg = damageInfo.damage * necromancyBonusDamagePerc;
        dealDamageOnHit(
          tower.unit,
          target.unit,
          dmg,
          true,
          necromancyAttackType
        );
      }
    }
  }

  export class SoulBattery extends Module {
    static readonly itemId = itemId('I009');
    name = 'Soul Battery';

    private charges = 0;

    get description(): string {
      return `Increases damage by 1% for every creep that dies within 300 range of this tower.|n|cff3399ccBonuses:|r|n+${
        this.charges
      }% damage ${this.charges == soulBatteryMaxBonus ? '(MAX)' : ''}.`;
    }

    get stats(): TowerStats {
      return TowerStats.damage(0, this.charges);
    }

    constructor(item: Item) {
      super(item);

      eventAnyUnitDeath.subscribe(dying => {
        if (!this.tower) {
          return;
        }
        if (this.charges >= soulBatteryMaxBonus) {
          return;
        }
        const distSq = dying.pos.distanceToSq(this.tower.unit.pos);
        if (distSq > soulBatteryRangeSq) {
          return;
        }
        this.charges++;
        this.tower.mods.change.emit();
      });
    }
  }
}
