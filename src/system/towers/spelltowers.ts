import {AttackType, attackTypeInvert} from 'combattypes';
import {isUnitCreep, SpellIds} from 'constants';
import {dealDamageSpell, onAttackDamage, onSpellDamage} from 'system/damage';
import {
  doAfter,
  doPeriodicallyCounted,
  findNearestUnit,
  Group,
  onAnyUnitDamaged,
  Unit,
} from 'w3lib/src/index';

export class SpellTowerEffects {
  constructor() {
    this.setupChainLightning();
  }

  private setupChainLightning() {
    onAttackDamage((target, attacker, info) => {
      if (attacker.getAbilityLevel(SpellIds.spellChainLightning) == 0) {
        return;
      }
      if (attacker.mana < 10) {
        return;
      }
      attacker.mana -= 10;
      attacker.startAbilityCooldown(SpellIds.spellChainLightning, 0.25);
      attacker.setAnimation('spell');
      let source = attacker;
      let targ = target;
      let damage = info.damage * 2;
      let alreadyHit = new Group();
      doPeriodicallyCounted(0.15, 5, cancel => {
        alreadyHit.addUnit(targ);
        const lightning = AddLightningEx(
          'CLPB',
          false,
          source.pos.x,
          source.pos.y,
          40,
          targ.pos.x,
          targ.pos.y,
          40
        );
        doAfter(0.3, () => DestroyLightning(lightning));
        dealDamageSpell(
          attacker,
          targ,
          damage,
          true,
          attackTypeInvert(info.attackType)
        );
        let nearest = findNearestUnit(
          targ.pos,
          500,
          u => isUnitCreep(u) && !alreadyHit.hasUnit(u) && u.isAlive()
        );
        if (!nearest) {
          cancel();
          return;
        }
        source = targ;
        targ = nearest;
        damage *= 0.75;
      });
    });
  }

  // private chainLightning(
  //   attacker: Unit,
  //   source: Unit,
  //   target: Unit,
  //   damage: number,
  //   attackType: AttackType,
  //   countLeft: number
  // ) {
  //   if (countLeft > 0) {
  //     const nextTarget = findNearestUnit(target.pos, 500, u => isUnitCreep(u));
  //     this.chainLightning(
  //       attacker,
  //       target,
  //       nextTarget,
  //       damage * 0.75,
  //       attackType,
  //       countLeft - 1
  //     );
  //   }
  // }
}
