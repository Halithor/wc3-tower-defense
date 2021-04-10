import {AttackType, attackTypeIndex, attackTypeString} from 'combattypes';
import {Unit} from 'w3lib/src/index';

const minimumCooldown = 0.1;

// TowerStats is the statistics of a given tower
export class TowerStats {
  constructor(
    readonly attackType: AttackType,
    readonly damage: number,
    readonly damagePerc: number,
    readonly range: number,
    readonly rangePerc: number,
    readonly cooldown: number,
    readonly cooldownPerc: number,
    readonly manaMax: number = 0,
    readonly manaMaxPerc: number = 0,
    readonly manaRegen: number = 0,
    readonly manaRegenPrec: number = 0
  ) {}

  private calcExpressed() {
    const atkType = this.attackType;
    const dmg = Math.round(this.damage * ((100 + this.damagePerc) * 0.01));
    const range = Math.round(this.range * ((100 + this.rangePerc) * 0.01));
    const cd = this.cooldown / ((100 + this.cooldownPerc) * 0.01);
    const manaMax = Math.round(
      this.manaMax * ((100 + this.manaMaxPerc) * 0.01)
    );
    const manaRegen = this.manaRegen * ((100 + this.manaRegenPrec) * 0.01);
    return {
      atkType,
      dmg,
      range,
      cd,
      manaMax,
      manaRegen,
    };
  }

  express(tower: Unit) {
    const {atkType, dmg, range, cd, manaMax, manaRegen} = this.calcExpressed();

    tower.setWeaponField(
      UNIT_WEAPON_IF_ATTACK_ATTACK_TYPE,
      0,
      attackTypeIndex(atkType)
    );
    // For some reason, this only works with index +1
    tower.setBaseDamage(Math.round(dmg) - 1, 0);
    // This just works, it's dumb but it works. The setter needs to be idx + 1, the getter needs as
    // expected. The 'setter' is actually an 'add to current value"
    const curRange = tower.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0);
    const rangeDiff = range - curRange;
    tower.setWeaponField(UNIT_WEAPON_RF_ATTACK_RANGE, 1, rangeDiff);
    tower.setWeaponField(UNIT_WEAPON_RF_ATTACK_BASE_COOLDOWN, 0, cd);
    tower.acquireRange = range + 128;
    tower.maxMana = manaMax;
    tower.setField(UNIT_RF_MANA_REGENERATION, manaRegen);
  }

  merge(other: TowerStats): TowerStats {
    let atkType = this.attackType;
    if (other.attackType != AttackType.Whoknows) {
      atkType = other.attackType;
    }
    return new TowerStats(
      atkType,
      this.damage + other.damage,
      this.damagePerc + other.damagePerc,
      this.range + other.range,
      this.rangePerc + other.rangePerc,
      this.cooldown + other.cooldown,
      this.cooldownPerc + other.cooldownPerc,
      this.manaMax + other.manaMax,
      this.manaMaxPerc + other.manaMaxPerc,
      this.manaRegen + other.manaRegen,
      this.manaRegenPrec + other.manaRegenPrec
    );
  }

  // integratePercentages merges the percent increases into the resulting stats.
  integratePercentages(): TowerStats {
    const {atkType, dmg, range, cd, manaMax, manaRegen} = this.calcExpressed();
    return new TowerStats(
      atkType,
      dmg,
      0,
      range,
      0,
      cd,
      0,
      manaMax,
      0,
      manaRegen,
      0
    );
  }

  toString(): string {
    const {atkType, dmg, range, cd, manaMax, manaRegen} = this.calcExpressed();

    let str = `|cff6699ffAttack Type:|r ${attackTypeString(atkType)}
|cff6699ffDamage:|r ${this.damage} + ${this.damagePerc}% = ${Math.round(dmg)}
|cff6699ffRange:|r ${this.range} + ${this.rangePerc}% = ${Math.round(range)}
|cff6699ffCooldown:|r ${string.format('%.2f', this.cooldown)} - ${
      this.cooldownPerc
    }% = ${string.format('%.2f', cd)} (${string.format('%.2f', 1 / cd)} APM)`;
    if (manaMax != 0) {
      str += `\n|cff6699ffMana:|r ${this.manaMax} + ${
        this.manaMaxPerc
      }% = ${Math.round(manaMax)}
|cff6699ffMana Regen:|r ${string.format('%.2f', this.manaRegen)} + ${
        this.manaRegenPrec
      }% = ${string.format('%.2f', manaRegen)}`;
    }
    return str;
  }

  static empty(): TowerStats {
    return new TowerStats(AttackType.Whoknows, 0, 0, 0, 0, 0, 0);
  }

  static attackType(atkType: AttackType) {
    return new TowerStats(atkType, 0, 0, 0, 0, 0, 0);
  }

  static damage(flat: number, percentage: number): TowerStats {
    return new TowerStats(AttackType.Whoknows, flat, percentage, 0, 0, 0, 0);
  }

  static range(flat: number, percentage: number): TowerStats {
    return new TowerStats(AttackType.Whoknows, 0, 0, flat, percentage, 0, 0);
  }

  static attackSpeed(flat: number, percentage: number): TowerStats {
    return new TowerStats(AttackType.Whoknows, 0, 0, 0, 0, flat, percentage);
  }

  static mana(flat: number, percentage: number): TowerStats {
    return new TowerStats(
      AttackType.Whoknows,
      0,
      0,
      0,
      0,
      0,
      0,
      flat,
      percentage
    );
  }

  static manaRegen(flat: number, percentage: number): TowerStats {
    return new TowerStats(
      AttackType.Whoknows,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      flat,
      percentage
    );
  }
}
