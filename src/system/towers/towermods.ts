import {
  Subject,
  Event,
  onAnyUnitConstructionFinish,
  Unit,
} from 'w3lib/src/index';
import {TowerStats} from './towerstats';

// Tower mods encapsulates the mods that are available on a given tower.
export class TowerMods {
  readonly change: Event<[]> = new Subject<[]>();

  constructor(private tower: Unit) {}

  stats(): TowerStats {
    return TowerStats.empty();
  }
}

export class TowerModSystem {
  constructor() {
    onAnyUnitConstructionFinish;
  }
}
