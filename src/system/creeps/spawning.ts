import {DefenseType, defenseTypeIndex, defenseTypeString} from 'combattypes';
import {playerEnemies} from 'constants';
import {SpawnInfo} from 'system/pathinfo';
import {
  unitId,
  Unit,
  degrees,
  doPeriodicallyCounted,
  doAfter,
  doPeriodically,
} from 'w3lib/src/index';
import {creep} from './creep';
import {CreepIds} from './creepids';
import {CreepTracker} from './creeptracker';

const defOptions = [
  DefenseType.Flesh,
  DefenseType.Unclean,
  DefenseType.Elemental,
  DefenseType.Natural,
  DefenseType.Construct,
  DefenseType.Demonic,
  DefenseType.Mystical,
];

export class CreepSpawning {
  constructor(
    private readonly tracker: CreepTracker,
    private spawns: SpawnInfo[]
  ) {
    let difficulty = 1;
    let level = 1;
    print('spawning');
    doAfter(10, () => {
      print(`Spawning level ${level}`);
      this.spawnLevel(difficulty, this.randomDefenseType());
      doPeriodically(45, () => {
        difficulty = difficulty * 1.01 + 1;
        print(`Spawning level ${level}`);
        this.spawnLevel(difficulty, this.randomDefenseType());
      });
    });
  }

  private randomDefenseType(): DefenseType {
    return defOptions[Math.floor(Math.random() * defOptions.length)];
  }

  spawnLevel(difficulty: number, defenseType: DefenseType) {
    const maxLife = Math.round(12 * difficulty);
    const armor = Math.floor(difficulty / 4) + 1;
    const movespeed = Math.round(280 + difficulty);

    const uid = CreepIds.list[Math.floor(Math.random() * CreepIds.list.length)];
    print(
      `SpawnLevel(${difficulty}, ${defenseTypeString(
        defenseType
      )}): ${maxLife} life / ${armor} armor / ${movespeed} ms`
    );
    doPeriodicallyCounted(0.8, 10, () => {
      this.spawns.forEach((spawnInfo, idx) => {
        const u = new Unit(
          playerEnemies[idx % 2],
          uid,
          spawnInfo.spawn.center,
          spawnInfo.spawn.center.angleTo(spawnInfo.moveTarget.center)
        );
        u.removeGuardPosition();
        u.issueOrderAt('move', spawnInfo.moveTarget.center);
        u.maxLife = maxLife;
        u.life = maxLife;
        u.armor = armor;
        u.moveSpeed = movespeed;
        u.setField(UNIT_IF_DEFENSE_TYPE, defenseTypeIndex(defenseType));
        this.tracker.addCreep(creep(u, spawnInfo.moveTarget));
      });
    });
  }
}
