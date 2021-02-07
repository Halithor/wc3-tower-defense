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

// the corresponding computer player for each player
export let playerComputers: MapPlayer[];

export class UnitIds {
  static readonly sellTower = unitId('h005');
}

export class SpellIds {
  static readonly allowTowerTurning = abilId('A00B');
  static readonly setRally = abilId('ARal');

  static readonly spellChainLightning = abilId('A009');
}

export class DestIds {}

export class ItemIds {}
