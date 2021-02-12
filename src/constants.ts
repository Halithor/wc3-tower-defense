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

export function isUnitCreep(u: Unit): boolean {
  return u.owner.id == playerEnemy1.id || u.owner.id == playerEnemy2.id;
}

export function getPlayerCount(): number {
  let count = 0;
  for (let i = 0; i < 6; i++) {
    if (Players[i].isIngame()) {
      count++;
    }
  }
  return count;
}

// the corresponding computer player for each player
export let playerComputers: MapPlayer[];

export class UnitIds {
  static readonly sellTower = unitId('h005');
}

export class SpellIds {
  static readonly allowTowerTurning = abilId('A00B');
  static readonly setRally = abilId('ARal');

  static readonly chainLightning = abilId('A009');
  static readonly shockwave = abilId('A007');
  static readonly warstomp = abilId('A008');
  static readonly energyNova = abilId('A00C');
  static readonly stormbolt = abilId('A00D');
}

export class DestIds {}

export class ItemIds {}
