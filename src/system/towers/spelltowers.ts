import {AttackType, attackTypeInvert} from 'combattypes';
import {isUnitCreep, SpellIds} from 'constants';
import {Projectile} from 'lib/projectile';
import {dealDamageSpell, onAttackDamage, onSpellDamage} from 'system/damage';
import {
  AbilId,
  DamageInfo,
  doAfter,
  doPeriodicallyCounted,
  findNearestUnit,
  Group,
  Unit,
} from 'w3lib/src/index';

const shockwavePath = 'Abilities\\Spells\\Orc\\Shockwave\\ShockwaveMissile.mdl';

export class SpellTowerEffects {
  constructor() {
    this.setupChainLightning();
    this.setupShockwave();
  }

  private setupSpell(
    spellId: AbilId,
    manaCost: number,
    cb: (target: Unit, attacker: Unit, damageInfo: DamageInfo) => void
  ) {
    onAttackDamage((target, attacker, info) => {
      if (attacker.getAbilityLevel(spellId) == 0) {
        return;
      }
      if (attacker.mana < manaCost) {
        return;
      }
      attacker.mana -= manaCost;
      attacker.startAbilityCooldown(spellId, 0.25);
      attacker.setAnimation('spell');
      cb(target, attacker, info);
    });
  }

  private setupChainLightning() {
    this.setupSpell(
      SpellIds.spellChainLightning,
      10,
      (target, attacker, info) => {
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
      }
    );
  }

  private setupShockwave() {
    this.setupSpell(SpellIds.spellShockwave, 10, (target, attacker, info) => {
      const atkType = attackTypeInvert(info.attackType);
      const range =
        attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0) * 1.5;
      const targetPos = attacker.pos.add(
        attacker.pos.normalizedPointerTo(target.pos).scale(range)
      );
      const projectile = new Projectile(
        attacker.pos.withTerrainZ(),
        targetPos.withTerrainZ(),
        1600,
        0,
        shockwavePath,
        hit => {
          if (hit instanceof Unit) {
            dealDamageSpell(attacker, hit, info.damage, false, atkType);
          }
        }
      ).impactsUnits(true, u => isUnitCreep(u));
    });
  }
}
