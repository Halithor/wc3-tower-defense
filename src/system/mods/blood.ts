import {AttackType} from 'combattypes';
import {DamageSource} from 'system/damage';
import {TowerCategories} from 'system/towers/towerconstants';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Module} from './module';
import {
  ConsecutiveAttackCounter,
  DamageFlatComponent,
  DisableModByCategoryComponent,
  TowerStatsComponent,
  UpdateOnEventComponent,
} from './standardComponents';

const bloodFrenzyBonusPerAttack = 3;
const bloodFrenzyAttackType = AttackType.Cursed;

const darkRitualSpeedDecrease = 2.0;
const darkRitualBonusDamagePerc = 66;

export namespace Blood {
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
      new DisableModByCategoryComponent([], [TowerCategories.AoE]),
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
