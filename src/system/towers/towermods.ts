import {Module} from 'system/mods/module';
import {Subject, Unit} from 'w3lib/src/index';
import {moduleTracker} from '../mods/moduleTracker';
import {TowerStats} from './towerstats';

// Tower mods encapsulates the mods that are available on a given tower.
export class TowerModules {
  readonly change: Subject<[]> = new Subject<[]>();

  constructor(private tower: Unit) {}

  stats(): TowerStats {
    return this.tower.items.reduce((acc, val) => {
      const moduleType = moduleTracker.get(val);
      if (moduleType) {
        return acc.merge(moduleType.stats);
      }
      return acc;
    }, TowerStats.empty());
  }

  modules(): Module[] {
    const mods: Module[] = [];
    this.tower.items.forEach(val => {
      const module = moduleTracker.get(val);
      if (module) {
        mods.push(module);
      }
    });
    return mods;
  }
}
