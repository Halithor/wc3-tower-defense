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
  flashEffect,
  forUnitsInRange,
  Group,
  Unit,
} from 'w3lib/src/index';

const shockwavePath = 'Abilities\\Spells\\Orc\\Shockwave\\ShockwaveMissile.mdl';
const warstompPath = 'Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl';
const energyNovaPath = 'Units\\NightElf\\Wisp\\WispExplode.mdl';

const lightningDamage = 3.0;
const lightningBounceScaling = 0.75;

const shockwaveDamageFactor = 2.0;
const shockwaveRangeFactor = 1.5;

const warstompDamageFactor = 2;

const novaDamageFactor = 2;
const novaPrimaryFactor = 1;
const novaAoEFactor = 0.33;

export class SpellTowerEffects {
  constructor() {
    this.setupChainLightning();
    this.setupShockwave();
    this.setupWarstomp();
    this.setupNova();
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
      attacker.startAbilityCooldown(spellId, 0.5);
      attacker.setAnimation('spell');
      cb(target, attacker, info);
    });
  }

  private setupChainLightning() {
    this.setupSpell(
      SpellIds.spellChainLightning,
      10,
      (target, attacker, info) => {
        const atkType = attackTypeInvert(info.attackType);
        let source = attacker;
        let targ = target;
        let damage = info.damage * lightningDamage;
        let alreadyHit = new Group();
        doPeriodicallyCounted(
          0.15,
          5,
          cancel => {
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
            dealDamageSpell(attacker, targ, damage, true, atkType);
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
            damage *= lightningBounceScaling;
          },
          () => alreadyHit.destroy()
        );
      }
    );
  }

  private setupShockwave() {
    this.setupSpell(SpellIds.spellShockwave, 10, (target, attacker, info) => {
      const atkType = attackTypeInvert(info.attackType);
      const travelDistance =
        attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0) *
        shockwaveRangeFactor;
      const targetPos = attacker.pos.add(
        attacker.pos.normalizedPointerTo(target.pos).scale(travelDistance)
      );
      const dmg = info.damage * shockwaveDamageFactor;
      const alreadyHit = new Group();
      const projectile = new Projectile(
        attacker.pos.moveTowards(target.pos, 30).withTerrainZ(),
        targetPos.withTerrainZ(),
        1300,
        0,
        shockwavePath,
        hit => {
          if (hit instanceof Unit) {
            alreadyHit.addUnit(hit);
            dealDamageSpell(attacker, hit, dmg, false, atkType);
          }
        }
      );
      projectile.impactsUnits(
        true,
        u =>
          isUnitCreep(u) &&
          !alreadyHit.hasUnit(u) &&
          !u.isUnitType(UNIT_TYPE_FLYING)
      );
      projectile.fx.scale = 0.8;
      projectile.onEnd.listen(() => alreadyHit.destroy());
    });
  }

  private setupWarstomp() {
    this.setupSpell(SpellIds.spellWarstomp, 10, (target, attacker, info) => {
      const atkType = attackTypeInvert(info.attackType);
      const range = attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0);
      const dmg = info.damage * warstompDamageFactor;
      flashEffect(warstompPath, attacker.pos);
      forUnitsInRange(attacker.pos, range, u => {
        if (isUnitCreep(u) && !u.isUnitType(UNIT_TYPE_FLYING)) {
          dealDamageSpell(attacker, u, dmg, false, atkType);
        }
      });
    });
  }

  private setupNova() {
    this.setupSpell(SpellIds.spellNova, 10, (target, attacker, info) => {
      const atkType = attackTypeInvert(info.attackType);
      const aoe =
        attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0) *
        novaAoEFactor;
      const dmg = info.damage * novaDamageFactor;
      const primaryDamage = info.damage * novaPrimaryFactor;
      dealDamageSpell(attacker, target, primaryDamage, false, atkType);
      forUnitsInRange(target.pos, aoe, u => {
        if (isUnitCreep(u) && !u.isUnitType(UNIT_TYPE_FLYING)) {
          dealDamageSpell(attacker, u, dmg, false, atkType);
        }
      });
      flashEffect(energyNovaPath, target.pos);
    });
  }
}
