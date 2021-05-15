import {PathingSystem} from 'system/pathing/pathingsystem';
import {CreepSystem} from 'system/creeps/creepsystem';
import {doAfter, eventAnyPlayerChat, Rectangle} from 'w3lib/src/index';
import {TowerSystem} from 'system/towers/towersystem';
import {PathInfo, SpawnInfo} from 'system/pathinfo';
import {EconomicSystem} from 'system/economics/economicsystem';
import {PlayerSystem} from 'system/players/playerSystem';
import {WaveSystem} from 'system/wavesystem';
import {towerTracker} from 'system/towers/towertracker';
import {Quests} from 'quests';
import {ClassSelection} from 'system/class/classSelection';
import {ClassApplication} from 'system/class/classApplication';
import {ModuleSystem} from 'system/mods/modulesystem';
import {moduleTracker} from 'system/mods/moduleTracker';
import {getPlayerCount} from 'constants';
import {creepTracker} from 'system/creeps/creeptracker';

export class Game {
  constructor() {}

  start() {
    this.setupCheats();
    const pathInfo = this.setupPathInfo();
    doAfter(1, () => {
      const players = new PlayerSystem();
      const quests = new Quests();

      // Trackers
      moduleTracker.setup();
      creepTracker.setup();
      towerTracker.setup();

      // Other systems
      const towers = new TowerSystem();
      const pathing = new PathingSystem(pathInfo);
      const economics = new EconomicSystem(players);
      const creeps = new CreepSystem(pathInfo);
      const classApplication = new ClassApplication(players);
      const modules = new ModuleSystem();

      const classSelection = new ClassSelection(players);
      classSelection.eventComplete.subscribe(() => {
        // Will start the game
        const waves = new WaveSystem(creeps.spawning, players);
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

  setupCheats() {
    if (getPlayerCount() > 1) {
      return;
    }
    eventAnyPlayerChat.subscribe((p, msg) => {
      if (msg.indexOf('cheat') != 0) {
        return;
      }
      const trimmed = msg.substr('cheat'.length).trim();
      if (trimmed.indexOf('gold') > -1) {
        p.gold += 1000;
      }
      if (trimmed.indexOf('wood') > -1 || trimmed.indexOf('lumber') > -1) {
        p.lumber += 1000;
      }
      if (trimmed.indexOf('food') > -1) {
        p.foodCap += 100;
      }
    });
  }
}
