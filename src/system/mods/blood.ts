import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {DamageSource, dealDamageOnHit} from 'system/damage';
import {TowerCategories} from 'system/towers/towerconstants';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {ModDamageInfo, Module} from './module';
import {
  ConsecutiveAttackCounter,
  DamageFlatComponent,
  DisableModByCategoryComponent,
  TowerStatsComponent,
  UpdateOnEventComponent,
} from './standardComponents';

const bloodFrenzyBonusPerAttack = 2;
const bloodFrenzyAttackType = AttackType.Cursed;

const darkRitualSpeedDecrease = 2.0;
const darkRitualBonusDamagePerc = 100;

export namespace Blood {
  const frenzyDisabler = new DisableModByCategoryComponent(
    [],
    [TowerCategories.AoE]
  );
  export class BloodFrenzy extends Module {
    static readonly itemId = itemId('I00B');
    name = 'Blood Frenzy';
    private readonly counter = new ConsecutiveAttackCounter();
    components = [
      this.counter,
      new DamageFlatComponent(
        [DamageSource.Attack],
        () => {
          return this.counter.count * bloodFrenzyBonusPerAttack;
        },
        bloodFrenzyAttackType,
        `Each consecutive attack on the same creep increases the damage by +${bloodFrenzyBonusPerAttack}.`
      ),
      frenzyDisabler,
      new UpdateOnEventComponent(this.counter.event),
    ];
  }

  const darkRitualCooldownComponent = new TowerStatsComponent(
    TowerStats.attackSpeed(darkRitualSpeedDecrease, 0),
    stats => `|cffaa0000+${stats.cooldown}|r seconds cooldown.`
  );
  const darkRitualDamageComponent = new TowerStatsComponent(
    TowerStats.damage(0, darkRitualBonusDamagePerc),
    stats => `|cffffcc00+${stats.damagePerc}%|r damage.`
  );
  export class DarkRitual extends Module {
    static readonly itemId = itemId('I00C');
    name = 'Dark Ritual';
    components = [darkRitualCooldownComponent, darkRitualDamageComponent];
  }
}
