import {PathingSystem} from 'content/pathingsystem';
import {SpawnSystem} from 'content/spawnsystem';
import {KeepPath} from 'lib/keeppath';
import {doAfter, FogModifier, Players, Rectangle} from 'w3lib/src/index';

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
    }
    doAfter(1, () => {
      const pathing = new PathingSystem();
      doAfter(2, () => {
        const spawn = new SpawnSystem();
      });
    });
  }
}
