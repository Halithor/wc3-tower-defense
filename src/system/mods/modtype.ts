import {TowerStats} from 'system/towers/towerstats';
import {ItemId} from 'w3lib/src/common';

// ModType contains the info about a given mod. In general these are unique for an item id.
export class ModType {
  constructor(
    readonly itemId: ItemId,
    readonly name: string,
    readonly description: string,
    private readonly _stats: TowerStats
  ) {}

  get stats(): TowerStats {
    return this._stats;
  }
}
