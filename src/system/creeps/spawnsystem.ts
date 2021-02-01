import {playerEnemies} from 'constants';
import {PathInfo, SpawnInfo} from 'system/pathinfo';
import {degrees, doPeriodically, Unit, unitId} from 'w3lib/src/index';
import {creep, CreepTracker} from './creeptracker';
import {CreepMoveOrders} from './moveorders';

export class SpawnSystem {
  private spawns: SpawnInfo[];
  private tracker: CreepTracker;
  private orders: CreepMoveOrders;

  constructor(pathInfo: PathInfo) {
    this.spawns = pathInfo.spawns;
    this.tracker = new CreepTracker();
    this.orders = new CreepMoveOrders(pathInfo);

    doPeriodically(4, () => this.spawn());
  }

  private spawn() {
    const uid = Math.random() > 0.5 ? unitId('n000') : unitId('n001');
    this.spawns.forEach((info, idx) => {
      const u = new Unit(
        playerEnemies[idx % 2],
        uid,
        info.spawn.center,
        degrees(270)
      );
      u.removeGuardPosition();
      u.issueOrderAt('move', info.moveTarget.center);
      this.tracker.addCreep(creep(u, info.moveTarget));
    });
  }
}
