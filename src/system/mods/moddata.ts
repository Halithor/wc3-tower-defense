import {AttackType} from 'combattypes';
import {dealDamageOnHit} from 'system/damage';
import {TowerStats} from 'system/towers/towerstats';
import {itemId, ItemId} from 'w3lib/src/common';
import {ModType as ModuleType} from './modtype';

export class ModuleItemIds {
  static readonly scryingStone = itemId('I000');
  static readonly manaStone = itemId('I001');
}

export class Modules {
  static readonly scryingStone = new ModuleType(
    itemId('I000'),
    'Scrying Stone',
    '',
    TowerStats.range(200, 0),
    {
      onAttackDamage: (creep, tower, damageInfo) => {
        dealDamageOnHit(tower.tower, creep, 2, true, AttackType.Arcane);
      },
    }
  );

  static readonly manaStone = new ModuleType(
    ModuleItemIds.manaStone,
    'Mana Stone',
    '',
    TowerStats.mana(5, 0).merge(TowerStats.manaRegen(0.25, 0))
  );
}

class ModuleMap {
  private map: {[key: string]: ModuleType} = {};

  add(module: ModuleType) {
    this.map[module.itemId.value] = module;
  }

  get(itemId: ItemId): ModuleType | undefined {
    return this.map[itemId.value];
  }
}

export const moduleMap = new ModuleMap();
moduleMap.add(Modules.manaStone);
moduleMap.add(Modules.scryingStone);
