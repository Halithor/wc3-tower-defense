import {AttackType} from 'combattypes';
import {
  DamageInfo,
  eventAnyUnitDamaging,
  onAnyUnitDamaged,
  onAnyUnitDamaging,
  Unit,
} from 'w3lib/src/index';

// If all of these are false, it is attack damage.
let isSpellDmg = false;
let isOnHitDmg = false;
let isNontriggerDmg = false;

export function dealDamageAttack(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  source.damageTarget(
    target.handle,
    amount,
    true,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
}

export function dealDamageSpell(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  isSpellDmg = true;
  source.damageTarget(
    target.handle,
    amount,
    false,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  isSpellDmg = false;
}

export function dealDamageOnHit(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  isOnHitDmg = true;
  source.damageTarget(
    target.handle,
    amount,
    false,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  isOnHitDmg = false;
}

export function dealDamageNontriggering(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  isNontriggerDmg = true;
  source.damageTarget(
    target.handle,
    amount,
    false,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  isNontriggerDmg = false;
}

export const eventAttackDamaging = eventAnyUnitDamaging.filter(
  () => !isNontriggerDmg && !isSpellDmg && !isOnHitDmg
);
export const eventSpellDamaging = eventAnyUnitDamaging.filter(() => isSpellDmg);
export const eventSpellOrAttackDamaging = eventAnyUnitDamaging.filter(
  () => !isNontriggerDmg && !isOnHitDmg
);
export const eventOnHitDamaging = eventAnyUnitDamaging.filter(() => isOnHitDmg);
export const eventAnyDamaging = eventAnyUnitDamaging;

export function onAttackDamage(
  cb: (
    target: Unit,
    attacker: Unit,
    damageInfo: DamageInfo
  ) => DamageInfo | void
) {
  onAnyUnitDamaging((target, attacker, info) => {
    if (isNontriggerDmg || isSpellDmg || isOnHitDmg) {
      return;
    }
    return cb(target, attacker, info);
  });
}

export function onSpellDamage(
  cb: (
    target: Unit,
    attacker: Unit,
    damageInfo: DamageInfo
  ) => DamageInfo | void
) {
  onAnyUnitDamaging((target, attacker, info) => {
    if (!isSpellDmg) {
      return;
    }
    return cb(target, attacker, info);
  });
}

export function onSpellOrAttackDamage(
  cb: (
    target: Unit,
    attacker: Unit,
    damageInfo: DamageInfo
  ) => DamageInfo | void
) {
  onAnyUnitDamaging((target, attacker, info) => {
    if (isNontriggerDmg || isOnHitDmg) {
      return;
    }
    return cb(target, attacker, info);
  });
}

export function onOnHitDamage(
  cb: (
    target: Unit,
    attacker: Unit,
    damageInfo: DamageInfo
  ) => DamageInfo | void
) {
  onAnyUnitDamaging((target, attacker, info) => {
    if (!isOnHitDmg) {
      return;
    }
    return cb(target, attacker, info);
  });
}

// WARNING: Do not cause any damage in this event
export function onAnyDamage(
  cb: (
    target: Unit,
    attacker: Unit,
    damageInfo: DamageInfo
  ) => DamageInfo | void
) {
  onAnyUnitDamaged((target, attacker, info) => {
    return cb(target, attacker, info);
  });
}
