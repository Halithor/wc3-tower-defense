import {TowerStats} from 'system/towers/towerstats';
import {itemId, ItemId} from 'w3lib/src/common';
import {ModType as ModuleType} from './modtype';

export class ModuleItemIds {
  static readonly manaStone = itemId('I001');
}

export class Modules {
  static readonly manaStone = new ModuleType(
    ModuleItemIds.manaStone,
    'Mana Stone',
    '',
    TowerStats.mana(5, 0).merge(TowerStats.manaRegen(0.25, 0))
  );
}

class ModuleMap {
  private map: {[key: string]: ModuleType} = {};

  set(itemId: ItemId, module: ModuleType) {
    this.map[itemId.value] = module;
  }

  get(itemId: ItemId): ModuleType | undefined {
    return this.map[itemId.value];
  }
}

export const moduleMap = new ModuleMap();
moduleMap.set(ModuleItemIds.manaStone, Modules.manaStone);
// moduleMap.set()
