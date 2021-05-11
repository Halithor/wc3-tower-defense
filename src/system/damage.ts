import {AttackType} from 'combattypes';
import {
  DamageInfo,
  eventAnyUnitDamaging,
  onAnyUnitDamaged,
  onAnyUnitDamaging,
  Unit,
} from 'w3lib/src/index';

export enum DamageSource {
  Attack,
  Spell,
  OnHit,
  NonTriggering,
}
const currentDamageSource: DamageSource[] = [];

export function dealDamageAttack(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  currentDamageSource.push(DamageSource.Attack);
  source.damageTarget(
    target.handle,
    amount,
    true,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  currentDamageSource.pop();
}

export function dealDamageSpell(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  currentDamageSource.push(DamageSource.Spell);
  source.damageTarget(
    target.handle,
    amount,
    false,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  currentDamageSource.pop();
}

export function dealDamageOnHit(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  currentDamageSource.push(DamageSource.OnHit);
  source.damageTarget(
    target.handle,
    amount,
    false,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  currentDamageSource.pop();
}

export function dealDamageNontriggering(
  source: Unit,
  target: Unit,
  amount: number,
  ranged: boolean,
  attackType: AttackType
) {
  currentDamageSource.push(DamageSource.NonTriggering);
  source.damageTarget(
    target.handle,
    amount,
    false,
    ranged,
    attackType.attackType,
    DAMAGE_TYPE_NORMAL,
    WEAPON_TYPE_WHOKNOWS
  );
  currentDamageSource.pop();
}

export const eventAttackDamaging = eventAnyUnitDamaging.filter(() => {
  if (currentDamageSource.length == 0) {
    return true;
  }
  const source = currentDamageSource[currentDamageSource.length - 1];
  return source == DamageSource.Attack;
});
export const eventSpellDamaging = eventAnyUnitDamaging.filter(() => {
  if (currentDamageSource.length == 0) {
    return false;
  }
  const source = currentDamageSource[currentDamageSource.length - 1];
  return source == DamageSource.Spell;
});
export const eventSpellOrAttackDamaging = eventAnyUnitDamaging.filter(() => {
  if (currentDamageSource.length == 0) {
    return true;
  }
  const source = currentDamageSource[currentDamageSource.length - 1];
  return source == DamageSource.Attack || source == DamageSource.Spell;
});
export const eventOnHitDamaging = eventAnyUnitDamaging.filter(() => {
  if (currentDamageSource.length == 0) {
    return false;
  }
  const source = currentDamageSource[currentDamageSource.length - 1];
  return source == DamageSource.OnHit;
});
export const eventAnyDamaging = eventAnyUnitDamaging;
