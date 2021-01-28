import {
  addScriptHook,
  Effect,
  flashEffect,
  Item,
  itemId,
  Rectangle,
  vec2,
  Vec2,
  W3TS_HOOK,
} from 'w3lib/src/index';
import {PriorityQueue} from './priorityqueue';

// used for item pathing hacks
let pathingItem: Item;
const pathingItemRangeSq = 100;

const up = vec2(0, 1);
const down = vec2(0, -1);
const left = vec2(-1, 0);
const right = vec2(1, 0);

const effectPath = 'Abilities\\Spells\\Human\\InnerFire\\InnerFireTarget.mdl';
const visitedEffectPath = 'Abilities\\Spells\\Undead\\Curse\\CurseTarget.mdl';
// the size of a pathing grid cell, in WC3 units.
const gridSize = 64;

// the offset of the center of grid locations, in WC3 units.
const gridOffset = 32;

// width of the grid in locations
const gridWidth = 960;
const gridWidthHalf = 480;

// move a given point onto the pathing grid
const roundToGrid = (pos: Vec2): Vec2 => {
  return fromGrid(toGrid(pos));
};

const toGrid = (normalPos: Vec2): Vec2 => {
  const x = Math.floor(normalPos.x / gridSize);
  const y = Math.floor(normalPos.y / gridSize);
  return vec2(x, y);
};

const fromGrid = (gridPos: Vec2): Vec2 => {
  return gridPos.scale(gridSize).add(vec2(gridOffset, gridOffset));
};

const gridToIndex = (pos: Vec2): number => {
  const normX = pos.x + gridWidthHalf;
  const normY = pos.y + gridWidthHalf;
  return normY * gridWidth + normX;
};

const indexToGrid = (index: number): Vec2 => {
  const normX = index % gridWidth;
  const normY = Math.floor(index / gridWidth);
  return vec2(normX - gridWidthHalf, normY - gridWidthHalf);
};

const manhattanDistance = (v1: Vec2, v2: Vec2) => {
  return Math.abs(v1.x - v2.x) + Math.abs(v1.y - v2.y);
};

const isWalkable = (pos: Vec2): boolean => {
  return !IsTerrainPathable(pos.x, pos.y, PATHING_TYPE_WALKABILITY);
};

function checkWalkable(pos: Vec2): boolean {
  // const itemSearchRect = new Rectangle(vec2(0, 0), vec2(128, 128));

  // First hide items in the way.
  // const itemsInWay: Item[] = [];
  // itemSearchRect.move(pos);
  // itemSearchRect.enumItems(null, () => {
  //   const i = Item.fromHandle(GetEnumItem());
  //   i.visible = false;
  //   itemsInWay.push(i);
  // });
  pathingItem.pos = pos; // Unhides the item
  const newPos = pathingItem.pos;
  pathingItem.visible = false; // hide it again
  // dummyItem.destroy();

  // Unhide items in the way
  // itemsInWay.forEach(i => {
  //   i.visible = true;
  // });

  return (
    newPos.distanceToSq(pos) < pathingItemRangeSq &&
    !IsTerrainPathable(pos.x, pos.y, PATHING_TYPE_WALKABILITY)
  );
}

// A pathing checker will check for a pathable point between two locations in WC3
export class PathingChecker {
  private effects: Effect[] = [];
  constructor(private readonly start: Vec2, private readonly goal: Vec2) {}

  isPathable(): boolean {
    this.effects.forEach(eff => {
      eff.destroy();
    });
    this.effects = [];

    const [gridPath, explored] = this.astar();
    gridPath.forEach(pos => {
      this.effects.push(new Effect(effectPath, fromGrid(pos)));
    });
    explored.forEach(pos => {
      this.effects.push(new Effect(visitedEffectPath, fromGrid(pos)));
    });

    return gridPath.length > 0;
  }

  getPath(): Vec2[] {
    const [gridPath, explored] = this.astar();

    return gridPath.map(v => fromGrid(v));
  }

  private astar(): [Vec2[], Vec2[]] {
    const start = toGrid(this.start);
    const end = toGrid(this.goal);
    const explored: Vec2[] = [];
    let exploreCount = 0;
    let startCount = 0;
    let endCount = 0;
    // this is index of node -> index of parent, length, startSide?
    const cameFrom: {[key: number]: [number, number, boolean]} = {};
    // frontier contains a list of ready to visit locations
    const startFrontier = new PriorityQueue<Vec2>(
      (v1, v2) => manhattanDistance(v1, end) < manhattanDistance(v2, end)
    );
    const endFrontier = new PriorityQueue<Vec2>(
      (v1, v2) => manhattanDistance(v1, start) < manhattanDistance(v2, start)
    );

    // start is exceptional, since it is it's own start.
    startFrontier.push(start);
    cameFrom[gridToIndex(start)] = [gridToIndex(start), 0, true];
    endFrontier.push(end);
    cameFrom[gridToIndex(end)] = [gridToIndex(end), 0, false];

    let foundPath = false;
    // connectingNodes will be the nodes in start and end frontiers that are the first to touch.
    let connectingNodes: [Vec2, Vec2] = [start, end];
    while (!startFrontier.isEmpty() && !endFrontier.isEmpty() && !foundPath) {
      exploreCount++;
      // Pick the best frontier to explore
      let exploring: Vec2;
      const startPeekDist = manhattanDistance(startFrontier.peek(), end);
      const endPeekDist = manhattanDistance(endFrontier.peek(), start);
      if (Math.random() < startPeekDist / (startPeekDist + endPeekDist)) {
        startCount++;
        exploring = startFrontier.pop();
      } else {
        endCount++;
        exploring = endFrontier.pop();
      }

      explored.push(exploring);
      const exploringIdx = gridToIndex(exploring);
      const [_, currentDist, isStartSide] = cameFrom[exploringIdx];

      const neighbors = [
        exploring.add(up),
        exploring.add(down),
        exploring.add(left),
        exploring.add(right),
      ];
      const nextDistance = currentDist + 1;
      for (let neighbor of neighbors) {
        const idx = gridToIndex(neighbor);
        const isNew = !(idx in cameFrom);
        if (isNew) {
          if (checkWalkable(fromGrid(neighbor))) {
            if (isStartSide) {
              startFrontier.push(neighbor);
            } else {
              endFrontier.push(neighbor);
            }
            cameFrom[idx] = [exploringIdx, nextDistance, isStartSide];
          }
        } else {
          const [_, neighborDistance, neighborIsStartSide] = cameFrom[idx];
          if (neighborIsStartSide != isStartSide) {
            // We found a path!
            foundPath = true;
            if (isStartSide) {
              connectingNodes = [exploring, neighbor];
            } else {
              connectingNodes = [neighbor, exploring];
            }
            break;
          }
          // idx in in cameFrom, check if the new dist is shorter and update
          if (neighborDistance > nextDistance) {
            cameFrom[idx] = [exploringIdx, nextDistance, isStartSide];
          }
        }
      }
    }
    // the non-start side is 'reverse' order of the start side, so we can reverse it to find the
    // complete path.
    if (foundPath) {
      let prevNode = gridToIndex(connectingNodes[0]);
      let prevDist = cameFrom[prevNode][1];
      let node = gridToIndex(connectingNodes[1]);
      while (node != gridToIndex(end)) {
        const [parent] = cameFrom[node];
        cameFrom[node] = [prevNode, prevDist + 1, true];
        prevDist = prevDist + 1;
        prevNode = node;
        node = parent;
      }
      cameFrom[gridToIndex(end)] = [prevNode, prevDist + 1, true];
    }

    const path: Vec2[] = [];
    if (foundPath) {
      let node = gridToIndex(end);
      while (node != cameFrom[node][0]) {
        path.push(indexToGrid(node));
        node = cameFrom[node][0];
      }
      path.push(indexToGrid(node));
    }

    // print(
    //   `explored ${explored.length} nodes; found path of ${path.length} length. Start:End ${startCount}:${endCount}`
    // );
    return [path, explored];
  }
}

function init() {
  pathingItem = new Item(itemId('wolg'), vec2(0, 0));
  pathingItem.visible = false;
}

addScriptHook(W3TS_HOOK.MAIN_BEFORE, init);
