import {isUnitTower} from 'system/towers/towerconstants';
import {TowerTracker} from 'system/towers/towertracker';
import {
  doAfter,
  eventUnitAcquiresItem,
  eventUnitLosesItem,
  Item,
  Unit,
} from 'w3lib/src/index';

export class ModuleSystem {
  constructor(private readonly towerTracker: TowerTracker) {
    eventUnitAcquiresItem.subscribe((u, i) => {
      this.onItemChange(u, i);
    });
    eventUnitLosesItem.subscribe((u, i) => {
      doAfter(0, () => this.onItemChange(u, i));
    });
  }

  private onItemChange(u: Unit, i: Item) {
    if (!isUnitTower(u)) {
      return;
    }
    const info = this.towerTracker.getTower(u);
    if (!info) {
      return;
    }
    info.mods.change.fire();
  }
}
