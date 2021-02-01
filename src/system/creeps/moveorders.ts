import {playerEnemy1, playerEnemy2} from 'constants';
import {PathInfo} from 'system/pathinfo';
import {onAnyUnitEntersRegion, Region} from 'w3lib/src/index';

// This class makes sure that creeps keep moving through the maze
export class CreepMoveOrders {
  constructor(pathInfo: PathInfo) {
    for (let i = 0; i < pathInfo.path.length; i++) {
      const start = pathInfo.path[i];
      const end = pathInfo.path[i == pathInfo.path.length - 1 ? 0 : i + 1];
      const reg = new Region();
      reg.addRect(start);
      onAnyUnitEntersRegion(reg, u => {
        if (u.owner.id != playerEnemy1.id && u.owner.id != playerEnemy2.id) {
          return;
        }
        u.issueOrderAt('move', end.center);
      });
    }
  }
}
