import {AttackType} from 'combattypes';
import {isUnitCreep, SpellIds} from 'constants';
import {Projectile} from 'lib/projectile';
import {Creep} from 'system/creeps/creep';
import {dealDamageSpell, eventAttackDamaging} from 'system/damage';
import {
  AbilId,
  DamageInfo,
  doAfter,
  doPeriodicallyCounted,
  Event,
  findNearestUnit,
  flashEffect,
  forUnitsInRange,
  Group,
  Subject,
  Unit,
} from 'w3lib/src/index';
import {TowerInfo} from './towerinfo';
import {TowerTracker} from './towertracker';

const shockwavePath = 'Abilities\\Spells\\Orc\\Shockwave\\ShockwaveMissile.mdl';
const warstompPath = 'Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl';
const energyNovaPath = 'Units\\NightElf\\Wisp\\WispExplode.mdl';
const stormboltEffectPath =
  'Abilities\\Spells\\Human\\StormBolt\\StormBoltMissile.mdl';

const lightningDamage = 3.0;
const lightningBounceScaling = 0.75;

const shockwaveDamageFactor = 2.0;
const shockwaveRangeFactor = 1.5;

const warstompDamageFactor = 2;

const novaDamageFactor = 2;
const novaPrimaryFactor = 1;
const novaAoEFactor = 0.33;

const stormhammerDamageFactor = 5;

const subjectTowerSpell = new Subject<[tower: TowerInfo]>();
export const eventTowerSpell: Event<[tower: TowerInfo]> = subjectTowerSpell;

export class SpellTowerEffects {
  constructor(private readonly towerTracker: TowerTracker) {
    this.setupChainLightning();
    this.setupShockwave();
    this.setupWarstomp();
    this.setupNova();
    this.setupStormbolt();
  }

  private setupSpell(
    spellId: AbilId,
    manaCost: number,
    cb: (target: Unit, attacker: Unit, damageInfo: DamageInfo) => void
  ) {
    eventAttackDamaging.subscribe((target, attacker, info) => {
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
      this.emitSpellEvent(attacker);
    });
  }

  private emitSpellEvent(tower: Unit) {
    const towerInfo = this.towerTracker.getTower(tower);
    if (!towerInfo) {
      return;
    }
    subjectTowerSpell.emit(towerInfo);
  }

  private setupChainLightning() {
    this.setupSpell(SpellIds.chainLightning, 10, (target, attacker, info) => {
      const atkType = AttackType.invert(info.attackType);
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
    });
  }

  private setupShockwave() {
    this.setupSpell(SpellIds.shockwave, 10, (target, attacker, info) => {
      const atkType = AttackType.invert(info.attackType);
      const travelDistance =
        (attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0) + 64) *
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
      projectile.onEnd.subscribe(() => alreadyHit.destroy());
    });
  }

  private setupWarstomp() {
    this.setupSpell(SpellIds.warstomp, 10, (target, attacker, info) => {
      const atkType = AttackType.invert(info.attackType);
      const range =
        attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0) + 64;
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
    this.setupSpell(SpellIds.energyNova, 10, (target, attacker, info) => {
      const atkType = AttackType.invert(info.attackType);
      const aoe =
        (attacker.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0) + 64) *
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

  private setupStormbolt() {
    this.setupSpell(SpellIds.stormbolt, 10, (target, attacker, info) => {
      const atkType = AttackType.invert(info.attackType);
      const dmg = info.damage * stormhammerDamageFactor;
      const projectile = new Projectile(
        attacker.pos.withZ(60),
        target,
        1200,
        100,
        stormboltEffectPath,
        u => {
          if (u instanceof Unit) {
            dealDamageSpell(attacker, u, dmg, false, atkType);
          }
        }
      );
    });
  }
}
