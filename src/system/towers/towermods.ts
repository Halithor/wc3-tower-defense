import {moduleMap} from 'system/mods/moddata';
import {Subject, Unit, eventUnitAcquiresItem} from 'w3lib/src/index';
import {isUnitTower} from './towerconstants';
import {TowerStats} from './towerstats';
import {TowerTracker} from './towertracker';

// Tower mods encapsulates the mods that are available on a given tower.
export class TowerMods {
  readonly change: Subject<[]> = new Subject<[]>();

  constructor(private tower: Unit) {}

  stats(): TowerStats {
    return this.tower.items.reduce((acc, val) => {
      const moduleType = moduleMap.get(val.typeId);
      if (moduleType) {
        return acc.merge(moduleType.stats);
      }
      return acc;
    }, TowerStats.empty());
  }
}
