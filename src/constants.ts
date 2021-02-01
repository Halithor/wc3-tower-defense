import {
  abilId,
  destId,
  itemId,
  MapPlayer,
  Players,
  Rectangle,
  unitId,
} from 'w3lib/src/index';

export const playerEnemy1 = Players[10];
export const playerEnemy2 = Players[11];
export const playerEnemies = [playerEnemy1, playerEnemy2];

// the corresponding computer player for each player
export let playerComputers: MapPlayer[];

export class UnitIds {
  static readonly sellTower = unitId('h005');
}

export class SpellIds {
  static readonly allowTowerTurning = abilId('A00B');
  static readonly setRally = abilId('ARal');
}

export class DestIds {}

export class ItemIds {}
