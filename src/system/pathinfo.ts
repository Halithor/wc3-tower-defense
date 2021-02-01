import {Rectangle, Region, Vec2} from 'w3lib/src/index';

export class SpawnInfo {
  constructor(readonly spawn: Rectangle, readonly moveTarget: Rectangle) {}
}

// PathInfo contains the information about the path the units will follow, including spawn
// locations and destinations. The path is in order of the creep behavior.
export class PathInfo {
  constructor(readonly path: Rectangle[], readonly spawns: SpawnInfo[]) {}
}
