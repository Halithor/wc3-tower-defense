import {
  abilId,
  destId,
  itemId,
  MapPlayer,
  Players,
  Rectangle,
  unitId,
} from 'w3lib/src/index';

export const playerEnemies1 = Players[10];
export const playerEnemies2 = Players[11];

// the corresponding computer player for each player
export let playerComputers: MapPlayer[];

export class UnitIds {
  static readonly shop = unitId('n000');

  static readonly cardMaster = unitId('H001');

  static readonly footman = unitId('h000');
  static readonly knight = unitId('h002');
  static readonly priest = unitId('h003');

  static readonly treant = unitId('e000');
  static readonly druid = unitId('e001');
  static readonly bear = unitId('e002');
}

export class SpellIds {}

export class DestIds {}

export class ItemIds {
  static readonly card = itemId('I000');

  static readonly goldCoins = itemId('I009');

  static readonly summonFootmen = itemId('I001');
  static readonly summonKnights = itemId('I003');
  static readonly summonPriests = itemId('I008');
  static readonly fireblast = itemId('I005');

  static readonly summonTreant = itemId('I002');
  static readonly summonDruids = itemId('I004');
  static readonly summonBear = itemId('I007');
  static readonly enliven = itemId('I006');
}
