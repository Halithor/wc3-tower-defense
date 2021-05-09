import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId, ItemId} from 'w3lib/src/common';
import {ModDamageInfo, Module} from './module';

const demonFireDamageBonusPerc = 0.2;
const demonFireAttackType = AttackType.Fire;

const demonFrostDamageBonusPerc = 0.2;
const demonFrostAttackType = AttackType.Frost;

export namespace Demon {
  export class DemonFire extends Module {
    static readonly itemId = itemId('I003');
    name = 'Demon Fire';
    get description() {
      return `On attack, deals bonus ${
        demonFireAttackType.nameColored
      } damage equal to ${Math.round(
        demonFireDamageBonusPerc * 100
      )}% of base damage.`;
    }
    get stats() {
      return TowerStats.empty();
    }

    onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      dealDamageOnHit(
        tower.unit,
        target.unit,
        demonFireDamageBonusPerc * damageInfo.damage,
        true,
        demonFireAttackType
      );
    }
  }
  export class DemonFrost extends Module {
    static readonly itemId = itemId('I004');
    name = 'Demon Frost';
    get description(): string {
      return `On attack, deals bonus ${
        demonFrostAttackType.nameColored
      } damage equal to ${Math.round(
        demonFrostDamageBonusPerc * 100
      )}% of base damage.`;
    }
    get stats() {
      return TowerStats.empty();
    }

    onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      dealDamageOnHit(
        tower.unit,
        target.unit,
        demonFrostDamageBonusPerc * damageInfo.damage,
        true,
        demonFrostAttackType
      );
    }
  }
}
