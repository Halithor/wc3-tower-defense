import {Module} from 'system/mods/module';
import {
  doAfter,
  eventUnitPawnsItemToShop,
  Item,
  Subject,
} from 'w3lib/src/index';

class ModuleTracker {
  readonly eventModuleDestruction = new Subject<[mod: Module]>();
  private modules: {[key: number]: Module} = {};

  setup() {
    eventUnitPawnsItemToShop.subscribe((seller, shop, item) => {
      this.removeModule(item);
    });
    this.eventModuleDestruction.subscribe(mod => {
      this.removeModule(mod.item);
    });
  }

  private removeModule(item: Item) {
    if (item.id in this.modules) {
      // delay by a second to allow for eol events to happen for the mod.
      doAfter(1, () => delete this.modules[item.id]);
    }
  }

  addModule(module: Module) {
    this.modules[module.item.id] = module;
  }

  get(item: Item): Module | undefined {
    return this.modules[item.id];
  }
}

export const moduleTracker = new ModuleTracker();
