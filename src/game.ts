import {PathingSystem} from 'system/pathing/pathingsystem';
import {CreepSystem} from 'system/creeps/creepsystem';
import {doAfter, Rectangle} from 'w3lib/src/index';
import {TowerSellingSystem} from 'system/towerselling';
import {TowerSystem} from 'system/towers/towersystem';
import {PathInfo, SpawnInfo} from 'system/pathinfo';
import {CreepTracker} from 'system/creeps/creeptracker';
import {EconomicSystem} from 'system/economics/economicsystem';
import {PlayerSystem} from 'system/players';

export class Game {
  constructor() {}

  start() {
    const pathInfo = this.setupPathInfo();
    doAfter(1, () => {
      const players = new PlayerSystem();
      const creepTracker = new CreepTracker();
      const towers = new TowerSystem();
      const selling = new TowerSellingSystem();
      const pathing = new PathingSystem(pathInfo);
      const economics = new EconomicSystem(creepTracker, players);
      doAfter(2, () => {
        const spawn = new CreepSystem(creepTracker, pathInfo);
      });
    });
  }

  setupPathInfo(): PathInfo {
    const spawn0 = Rectangle.fromHandle(gg_rct_Spawn0);
    const spawn1 = Rectangle.fromHandle(gg_rct_Spawn1);
    const spawn2 = Rectangle.fromHandle(gg_rct_Spawn2);
    const spawn3 = Rectangle.fromHandle(gg_rct_Spawn3);
    const check0 = Rectangle.fromHandle(gg_rct_Check0);
    const check1 = Rectangle.fromHandle(gg_rct_Check1);
    const check2 = Rectangle.fromHandle(gg_rct_Check2);
    const check3 = Rectangle.fromHandle(gg_rct_Check3);
    const check4 = Rectangle.fromHandle(gg_rct_Check4);
    const check5 = Rectangle.fromHandle(gg_rct_Check5);

    return new PathInfo(
      [check0, check1, check2, check3, check4, check5],
      [
        new SpawnInfo(spawn0, check3),
        new SpawnInfo(spawn1, check1),
        new SpawnInfo(spawn2, check0),
        new SpawnInfo(spawn3, check2),
      ]
    );
  }
}
