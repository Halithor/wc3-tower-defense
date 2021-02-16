import {AttackType} from 'combattypes';
import {Unit, UnitId, unitId} from 'w3lib/src/index';
import {TowerInfo} from './towerinfo';
import {TowerStats} from './towerstats';

const defaultAtkType = AttackType.Physical;

export class TowerIds {
  // basic towers
  static readonly basicArrowTower = unitId('h006');
  static readonly basicMeleeTower = unitId('h001');
  static readonly basicMagicTower = unitId('h00H');
  static readonly basicRockTower = unitId('h00G');

  // Melee Towers
  static readonly rpdMeleeTower = unitId('h002');
  static readonly stdMeleeTower = unitId('h003');
  static readonly hvyMeleeTower = unitId('h004');

  // Single towers
  static readonly rpdSpearTower = unitId('h00F');
  static readonly stdSpearTower = unitId('h00D');
  static readonly hvySpearTower = unitId('h00E');
  static readonly rpdArrowTower = unitId('h008');
  static readonly stdArrowTower = unitId('h007');
  static readonly hvyArrowTower = unitId('h009');
  static readonly rpdSniperTower = unitId('h00C');
  static readonly stdSniperTower = unitId('h00A');
  static readonly hvySniperTower = unitId('h00B');

  // AoE towers
  static readonly rpdSplashTower = unitId('h00M');
  static readonly stdSplashTower = unitId('h00L');
  static readonly hvySplashTower = unitId('h00N');
  static readonly rpdRockTower = unitId('h00K');
  static readonly stdRockTower = unitId('h00I');
  static readonly hvyRockTower = unitId('h00J');
  static readonly rpdSiegeTower = unitId('h00Q');
  static readonly stdSiegeTower = unitId('h00O');
  static readonly hvySiegeTower = unitId('h00P');

  // Magic towers
  static readonly chainLightning = unitId('h00R');
  static readonly stormbolt = unitId('h00V');
  static readonly shockwave = unitId('h00S');
  static readonly energyNove = unitId('h00U');
  static readonly warstomp = unitId('h00T');
}

export function isUnitTower(u: Unit) {
  const uid = u.typeId;
  return (
    u.isUnitType(UNIT_TYPE_STRUCTURE) &&
    (TowerIds.basicArrowTower.equals(uid) ||
      TowerIds.basicMeleeTower.equals(uid) ||
      TowerIds.basicMagicTower.equals(uid) ||
      TowerIds.basicRockTower.equals(uid) ||
      TowerIds.rpdMeleeTower.equals(uid) ||
      TowerIds.stdMeleeTower.equals(uid) ||
      TowerIds.hvyMeleeTower.equals(uid) ||
      TowerIds.rpdSpearTower.equals(uid) ||
      TowerIds.stdSpearTower.equals(uid) ||
      TowerIds.hvySpearTower.equals(uid) ||
      TowerIds.rpdArrowTower.equals(uid) ||
      TowerIds.stdArrowTower.equals(uid) ||
      TowerIds.hvyArrowTower.equals(uid) ||
      TowerIds.rpdSniperTower.equals(uid) ||
      TowerIds.stdSniperTower.equals(uid) ||
      TowerIds.hvySniperTower.equals(uid) ||
      TowerIds.rpdSplashTower.equals(uid) ||
      TowerIds.stdSplashTower.equals(uid) ||
      TowerIds.hvySplashTower.equals(uid) ||
      TowerIds.rpdRockTower.equals(uid) ||
      TowerIds.stdRockTower.equals(uid) ||
      TowerIds.hvyRockTower.equals(uid) ||
      TowerIds.rpdSiegeTower.equals(uid) ||
      TowerIds.stdSiegeTower.equals(uid) ||
      TowerIds.hvySiegeTower.equals(uid) ||
      TowerIds.chainLightning.equals(uid) ||
      TowerIds.stormbolt.equals(uid) ||
      TowerIds.shockwave.equals(uid) ||
      TowerIds.energyNove.equals(uid) ||
      TowerIds.warstomp.equals(uid))
  );
}

// get the base tower stats for each type of tower
export function baseTowerStats(towerId: UnitId): TowerStats {
  switch (towerId.value) {
    case TowerIds.basicArrowTower.value:
      return new TowerStats(defaultAtkType, 5, 0, 700, 0, 2.0, 0);
    case TowerIds.basicMeleeTower.value:
      return new TowerStats(defaultAtkType, 10, 0, 128, 0, 2.0, 0);
    case TowerIds.basicMagicTower.value:
      return new TowerStats(defaultAtkType, 5, 0, 700, 0, 3.0, 0, 25, 0, 1, 0);
    case TowerIds.basicRockTower.value:
      return new TowerStats(defaultAtkType, 5, 0, 700, 0, 2.0, 0);
    // === Melee ===
    case TowerIds.rpdMeleeTower.value:
      return new TowerStats(defaultAtkType, 10, 0, 128, 0, 1.0, 0);
    case TowerIds.stdMeleeTower.value:
      return new TowerStats(defaultAtkType, 20, 0, 128, 0, 2.0, 0);
    case TowerIds.hvyMeleeTower.value:
      return new TowerStats(defaultAtkType, 40, 0, 128, 0, 4.0, 0);
    // === Single Target ===
    case TowerIds.rpdSpearTower.value:
      return new TowerStats(defaultAtkType, 6, 0, 400, 0, 0.8, 0);
    case TowerIds.stdSpearTower.value:
      return new TowerStats(defaultAtkType, 12, 0, 400, 0, 1.6, 0);
    case TowerIds.hvySpearTower.value:
      return new TowerStats(defaultAtkType, 24, 0, 400, 0, 3.2, 0);
    case TowerIds.rpdArrowTower.value:
      return new TowerStats(defaultAtkType, 5, 0, 700, 0, 1.0, 0);
    case TowerIds.stdArrowTower.value:
      return new TowerStats(defaultAtkType, 10, 0, 700, 0, 2.0, 0);
    case TowerIds.hvyArrowTower.value:
      return new TowerStats(defaultAtkType, 20, 0, 700, 0, 4.0, 0);
    case TowerIds.rpdSniperTower.value:
      return new TowerStats(defaultAtkType, 4, 0, 1000, 0, 1.2, 0);
    case TowerIds.stdSniperTower.value:
      return new TowerStats(defaultAtkType, 8, 0, 1000, 0, 2.2, 0);
    case TowerIds.hvySniperTower.value:
      return new TowerStats(defaultAtkType, 16, 0, 1000, 0, 4.4, 0);
    // === AoE ===
    case TowerIds.rpdSplashTower.value:
      return new TowerStats(defaultAtkType, 6, 0, 400, 0, 0.8, 0);
    case TowerIds.stdSplashTower.value:
      return new TowerStats(defaultAtkType, 12, 0, 400, 0, 1.6, 0);
    case TowerIds.hvySplashTower.value:
      return new TowerStats(defaultAtkType, 24, 0, 400, 0, 3.2, 0);
    case TowerIds.rpdRockTower.value:
      return new TowerStats(defaultAtkType, 5, 0, 700, 0, 1, 0);
    case TowerIds.stdRockTower.value:
      return new TowerStats(defaultAtkType, 10, 0, 700, 0, 2.0, 0);
    case TowerIds.hvyRockTower.value:
      return new TowerStats(defaultAtkType, 20, 0, 700, 0, 4.0, 0);
    case TowerIds.rpdSiegeTower.value:
      return new TowerStats(defaultAtkType, 4, 0, 1000, 0, 1.2, 0);
    case TowerIds.stdSiegeTower.value:
      return new TowerStats(defaultAtkType, 8, 0, 1000, 0, 2.4, 0);
    case TowerIds.hvySiegeTower.value:
      return new TowerStats(defaultAtkType, 16, 0, 1000, 0, 4.4, 0);
    // === Magical ===
    case TowerIds.chainLightning.value:
      return new TowerStats(defaultAtkType, 10, 0, 700, 0, 3.0, 0, 25, 0, 1.0);
    case TowerIds.stormbolt.value:
      return new TowerStats(defaultAtkType, 10, 0, 700, 0, 3.0, 0, 25, 0, 1.0);
    case TowerIds.shockwave.value:
      return new TowerStats(defaultAtkType, 10, 0, 700, 0, 3.0, 0, 25, 0, 1.0);
    case TowerIds.energyNove.value:
      return new TowerStats(defaultAtkType, 10, 0, 700, 0, 3.0, 0, 25, 0, 1.0);
    case TowerIds.warstomp.value:
      return new TowerStats(defaultAtkType, 15, 0, 128, 0, 3.0, 0, 25, 0, 1.0);
  }
  return new TowerStats(defaultAtkType, 5, 0, 700, 0, 2.0, 0);
}

export function towerGoldValue(towerId: UnitId): number {
  if (
    towerId.equals(TowerIds.basicArrowTower) ||
    towerId.equals(TowerIds.basicMagicTower) ||
    towerId.equals(TowerIds.basicMeleeTower) ||
    towerId.equals(TowerIds.basicRockTower)
  ) {
    return 5;
  }
  return 15;
}
