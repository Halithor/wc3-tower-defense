import {
  abilId,
  destId,
  itemId,
  MapPlayer,
  Players,
  Rectangle,
  Unit,
  unitId,
} from 'w3lib/src/index';

export const playerEnemy1 = Players[10];
export const playerEnemy2 = Players[11];
export const playerEnemies = [playerEnemy1, playerEnemy2];
export const playerHumans = [
  Players[0],
  Players[1],
  Players[2],
  Players[3],
  Players[4],
  Players[5],
];

export function isUnitCreep(u: Unit): boolean {
  return u.owner.id == playerEnemy1.id || u.owner.id == playerEnemy2.id;
}

export function getPlayerCount(): number {
  let count = 0;
  playerHumans.forEach(p => {
    if (p.isIngame()) {
      count++;
    }
  });
  return count;
}

// the corresponding computer player for each player
export let playerComputers: MapPlayer[];

export class UnitIds {
  static readonly sellTower = unitId('h005');

  static readonly classPurchaser = unitId('h00Y');
  static readonly classTavern = unitId('n008');

  static readonly builderWarrior = unitId('u000');
  static readonly builderDruid = unitId('u001');
  static readonly builderSorceress = unitId('u002');
  static readonly builderEngineer = unitId('u003');
  static readonly builderGravedigger = unitId('u004');
  static readonly builderFrozenSpirit = unitId('u005');

  static readonly upgradeDamage = unitId('h00W');
  static readonly upgradeSpeed = unitId('h00X');
}

export class SpellIds {
  static readonly allowTowerTurning = abilId('A00B');
  static readonly setRally = abilId('ARal');
  static readonly showTowerStats = abilId('A00E');

  static readonly chainLightning = abilId('A009');
  static readonly shockwave = abilId('A007');
  static readonly warstomp = abilId('A008');
  static readonly energyNova = abilId('A00C');
  static readonly stormbolt = abilId('A00D');
}

export class DestIds {}

export class ItemIds {}
