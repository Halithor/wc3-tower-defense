import {PathInfo} from 'system/pathinfo';
import {KeepPath} from 'system/pathing/keeppath';
import {doPeriodically, playerColors} from 'w3lib/src/index';

export class PathingSystem {
  private keepers: KeepPath[] = [];
  private spawnKeepers: KeepPath[] = [];

  constructor(private pathInfo: PathInfo) {
    for (let i = 0; i < pathInfo.path.length - 1; i++) {
      const start = pathInfo.path[i];
      const end = pathInfo.path[i + 1];
      this.keepers.push(new KeepPath(start.center, end.center));
    }
    this.keepers.push(
      new KeepPath(
        pathInfo.path[pathInfo.path.length - 1].center,
        pathInfo.path[0].center,
        playerColors[pathInfo.path.length]
      )
    );

    pathInfo.spawns.forEach(info => {
      this.spawnKeepers.push(
        new KeepPath(info.spawn.center, info.moveTarget.center)
      );
    });

    doPeriodically(30, () => {
      let totalLength = 0;
      this.keepers.forEach(keeper => (totalLength += keeper.length));
      print(`Maze length: ${totalLength}`);
    });
  }
}
