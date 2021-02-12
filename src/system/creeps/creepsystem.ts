import {playerEnemies} from 'constants';
import {PathInfo, SpawnInfo} from 'system/pathinfo';
import {degrees, doPeriodically, Unit, unitId} from 'w3lib/src/index';
import {creep} from './creep';
import {CreepTracker} from './creeptracker';
import {CreepMoveOrders} from './moveorders';
import {CreepSpawning} from './spawning';

export class CreepSystem {
  readonly orders: CreepMoveOrders;
  readonly spawning: CreepSpawning;

  constructor(readonly creepTracker: CreepTracker, pathInfo: PathInfo) {
    this.orders = new CreepMoveOrders(creepTracker, pathInfo);
    this.spawning = new CreepSpawning(creepTracker, pathInfo.spawns);
  }
}
