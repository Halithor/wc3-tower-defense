import {Module} from 'system/mods/module';
import {
  doAfter,
  Event,
  eventUnitPawnsItemToShop,
  Item,
  Subject,
} from 'w3lib/src/index';

class ModuleTracker {
  private readonly subjectRemoveModule = new Subject<[mod: Module]>();
  readonly eventModuleDestruction: Event<[mod: Module]> = this
    .subjectRemoveModule;
    
  private modules: {[key: number]: Module} = {};

  setup() {
    eventUnitPawnsItemToShop.subscribe((seller, shop, item) => {
      this.destroyModule(item);
    });
  }

  destroyModule(item: Item) {
    const id = item.id;
    if (id in this.modules) {
      this.subjectRemoveModule.emit(this.modules[id]);
      // delay by a second to allow for eol events to happen for the mod.
      doAfter(1, () => {
        this.modules[id].destroy();
        delete this.modules[id];
      });
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
