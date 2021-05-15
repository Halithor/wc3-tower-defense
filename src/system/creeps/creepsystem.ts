import {GameState} from 'system/gamestate';
import {PathInfo} from 'system/pathinfo';
import {CreepMoveOrders} from './moveorders';
import {CreepSpawning} from './spawning';

export class CreepSystem {
  readonly orders: CreepMoveOrders;
  readonly spawning: CreepSpawning;

  constructor(pathInfo: PathInfo, gameState: GameState) {
    this.orders = new CreepMoveOrders(pathInfo);
    this.spawning = new CreepSpawning(pathInfo.spawns, gameState);
  }
}
