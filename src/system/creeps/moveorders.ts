import {playerEnemy1, playerEnemy2} from 'constants';
import {PathInfo} from 'system/pathinfo';
import {
  doAfter,
  doPeriodically,
  forUnitsInRange,
  onAnyUnitConstructionStart,
  onAnyUnitEntersRegion,
  Region,
} from 'w3lib/src/index';
import {CreepTracker} from './creeptracker';

// This class makes sure that creeps keep moving through the maze
export class CreepMoveOrders {
  constructor(private readonly tracker: CreepTracker, pathInfo: PathInfo) {
    for (let i = 0; i < pathInfo.path.length; i++) {
      const start = pathInfo.path[i];
      const end = pathInfo.path[i == pathInfo.path.length - 1 ? 0 : i + 1];
      const reg = new Region();
      reg.addRect(start);
      onAnyUnitEntersRegion(reg, u => {
        if (u.owner.id != playerEnemy1.id && u.owner.id != playerEnemy2.id) {
          return;
        }
        const creep = tracker.getCreep(u);
        if (!creep) {
          return;
        }
        if (creep.moveTarget != start) {
          return;
        }
        creep.moveTarget = end;
      });
    }
    // Re-order move for all nearby creeps.
    onAnyUnitConstructionStart(constructed => {
      forUnitsInRange(constructed.pos, 200, u => {
        const creep = tracker.getCreep(u);
        if (creep) {
          doAfter(1.0, () => {
            creep.orderMove();
          });
        }
      });
    });
  }
}
