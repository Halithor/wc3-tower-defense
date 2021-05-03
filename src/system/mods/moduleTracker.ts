import {Module} from 'system/mods/module';
import {eventUnitPawnsItemToShop, Item} from 'w3lib/src/index';

class ModuleTracker {
  private modules: {[key: number]: Module} = {};

  setup() {
    eventUnitPawnsItemToShop.subscribe((seller, shop, item) => {
      if (item.id in this.modules) {
        delete this.modules[item.id];
      }
    });
  }

  addModule(module: Module) {
    this.modules[module.item.id] = module;
  }

  get(item: Item): Module | undefined {
    return this.modules[item.id];
  }
}

export const moduleTracker = new ModuleTracker();
