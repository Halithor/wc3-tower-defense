import {PlayerSystem} from 'system/players/playerSystem';
import {towerTracker} from 'system/towers/towertracker';

// ClassApplication applies the effects of a players class in the game.
export class ClassApplication {
  constructor(players: PlayerSystem) {
    towerTracker.eventNewTower.subscribe(towerInfo => {
      const playerInfo = players.getInfo(towerInfo.unit.owner);
      if (!playerInfo) {
        return;
      }

      towerInfo.classStats = playerInfo.classInfo.towerStats;
      playerInfo.classInfo.onTower(towerInfo);
    });
  }
}
