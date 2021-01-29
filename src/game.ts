import {PathingSystem} from 'system/pathing/pathingsystem';
import {SpawnSystem} from 'system/creeps/spawnsystem';
import {doAfter, FogModifier, Players, Rectangle, Trigger} from 'w3lib/src/index';
import {TowerSellingSystem} from 'system/towerselling';
import {SpellIds} from 'constants';

export class Game {
  constructor() {}

  start() {
    for (let i = 0; i < 6; i++) {
      const fog = FogModifier.fromRect(
        Players[i],
        FOG_OF_WAR_VISIBLE,
        Rectangle.fromHandle(gg_rct_Vision),
        true,
        true
      );
      fog.start();
      Players[i].setAbilityAvailable(SpellIds.allowTowerTurning, false);
    }
    doAfter(1, () => {
      const selling = new TowerSellingSystem();
      const pathing = new PathingSystem();
      doAfter(2, () => {
        const spawn = new SpawnSystem();
      });
    });
  }
}
