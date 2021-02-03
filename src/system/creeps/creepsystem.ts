import {playerEnemies} from 'constants';
import {PathInfo, SpawnInfo} from 'system/pathinfo';
import {degrees, doPeriodically, Unit, unitId} from 'w3lib/src/index';
import {creep} from './creep';
import {CreepTracker} from './creeptracker';
import {CreepMoveOrders} from './moveorders';
import {CreepSpawning} from './spawning';

export class CreepSystem {
  private tracker: CreepTracker;
  private orders: CreepMoveOrders;
  private spawning: CreepSpawning;

  constructor(pathInfo: PathInfo) {
    this.tracker = new CreepTracker();
    this.orders = new CreepMoveOrders(this.tracker, pathInfo);
    this.spawning = new CreepSpawning(this.tracker, pathInfo.spawns);
  }
}
