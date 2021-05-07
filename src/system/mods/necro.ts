import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {ModDamageInfo, Module} from './module';

const necromancyKillsNeeded = 20;
const necromancyBonusMana = 5;
const necromancyBonusDamagePerc = 0.2;
const necromancyAttackType = AttackType.Cursed;

export namespace Necro {
  export class Necromancer extends Module {
    static readonly itemId = itemId('I008');
    name = 'Necromancy';

    private completed = false;
    private kills = 0;

    get description(): string {
      print('get description');
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
          tower.tower,
          target.unit,
          dmg,
          true,
          necromancyAttackType
        );
      }
    }
  }
}
