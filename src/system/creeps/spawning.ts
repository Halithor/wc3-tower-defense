import {DefenseType, defenseTypeIndex, defenseTypeString} from 'combattypes';
import {getPlayerCount, playerEnemies} from 'constants';
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

enum WaveFormat {
  Standard,
  Challenge,
  Boss,
  Mass,
}

const waveFormatOptions = [
  WaveFormat.Standard,
  WaveFormat.Challenge,
  WaveFormat.Boss,
  WaveFormat.Mass,
];

function waveFormatString(format: WaveFormat): string {
  switch (format) {
    case WaveFormat.Standard:
      return 'Normal';
    case WaveFormat.Challenge:
      return 'Challenge';
    case WaveFormat.Boss:
      return 'Boss';
    case WaveFormat.Mass:
      return 'Mass';
  }
}
// LevelInfo describes the characteristics of a level.
class LevelInfo {
  constructor(readonly format: WaveFormat, readonly defenseType: DefenseType) {}
}

export class CreepSpawning {
  constructor(
    private readonly tracker: CreepTracker,
    private spawns: SpawnInfo[]
  ) {
    let difficulty = 1;
    let level = 1;
    doAfter(10, () => {
      print(`Spawning level ${level}`);
      this.spawnLevel(difficulty, this.randomLevelInfo());
      doPeriodically(45, () => {
        difficulty = difficulty * 1.01 + 1;
        print(`Spawning level ${level}`);
        this.spawnLevel(difficulty, this.randomLevelInfo());
      });
    });
  }

  private randomLevelInfo(): LevelInfo {
    return new LevelInfo(
      waveFormatOptions[Math.floor(Math.random() * waveFormatOptions.length)],
      defOptions[Math.floor(Math.random() * defOptions.length)]
    );
  }

  spawnLevel(difficulty: number, levelInfo: LevelInfo) {
    const maxLife = Math.round(16 * difficulty * getPlayerCount());
    const armor = Math.floor(difficulty / 2) + 1;
    const movespeed = Math.round(280 + difficulty);

    const uid = CreepIds.list[Math.floor(Math.random() * CreepIds.list.length)];
    print(
      `${waveFormatString(
        levelInfo.format
      )}@${difficulty} w/ ${defenseTypeString(
        levelInfo.defenseType
      )} defense / ${maxLife} life / ${armor} armor / ${movespeed} ms`
    );
    if (levelInfo.format == WaveFormat.Standard) {
      doPeriodicallyCounted(1.0, 10, () => {
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
          u.setField(
            UNIT_IF_DEFENSE_TYPE,
            defenseTypeIndex(levelInfo.defenseType)
          );
          this.tracker.addCreep(creep(u, 1, spawnInfo.moveTarget));
        });
      });
    } else if (levelInfo.format == WaveFormat.Boss) {
      this.spawns.forEach((spawnInfo, idx) => {
        const u = new Unit(
          playerEnemies[idx % 2],
          uid,
          spawnInfo.spawn.center,
          spawnInfo.spawn.center.angleTo(spawnInfo.moveTarget.center)
        );
        u.removeGuardPosition();
        u.issueOrderAt('move', spawnInfo.moveTarget.center);
        u.maxLife = maxLife * 20;
        u.life = maxLife * 20;
        u.armor = armor * 3;
        u.moveSpeed = Math.floor(movespeed * 0.8);
        const scale = u.getField(UNIT_RF_SCALING_VALUE);
        if (typeof scale == 'number') {
          u.setScale(2.5 * scale, 2.5 * scale, 2.5 * scale);
        }
        u.name = 'The Strongest ' + u.name;
        u.setField(
          UNIT_IF_DEFENSE_TYPE,
          defenseTypeIndex(levelInfo.defenseType)
        );
        this.tracker.addCreep(creep(u, 10, spawnInfo.moveTarget));
      });
    } else if (levelInfo.format == WaveFormat.Mass) {
      doPeriodicallyCounted(0.4, 20, () => {
        this.spawns.forEach((spawnInfo, idx) => {
          const u = new Unit(
            playerEnemies[idx % 2],
            uid,
            spawnInfo.spawn.center,
            spawnInfo.spawn.center.angleTo(spawnInfo.moveTarget.center)
          );
          u.removeGuardPosition();
          u.issueOrderAt('move', spawnInfo.moveTarget.center);
          u.maxLife = Math.round(maxLife / 2);
          u.life = Math.round(maxLife / 2);
          u.armor = armor;
          u.moveSpeed = Math.round(movespeed * 0.9);
          u.setField(
            UNIT_IF_DEFENSE_TYPE,
            defenseTypeIndex(levelInfo.defenseType)
          );
          this.tracker.addCreep(creep(u, 1, spawnInfo.moveTarget));
        });
      });
    } else if (levelInfo.format == WaveFormat.Challenge) {
      doPeriodicallyCounted(1.2, 7, (_cancel, creepIndex) => {
        this.spawns.forEach((spawnInfo, idx) => {
          const u = new Unit(
            playerEnemies[idx % 2],
            uid,
            spawnInfo.spawn.center,
            spawnInfo.spawn.center.angleTo(spawnInfo.moveTarget.center)
          );
          u.removeGuardPosition();
          u.issueOrderAt('move', spawnInfo.moveTarget.center);
          let value = 1;
          u.maxLife = maxLife;
          u.life = maxLife;
          u.armor = armor;
          u.moveSpeed = Math.round(movespeed * 0.9);
          if (creepIndex === 1 || creepIndex === 3 || creepIndex === 5) {
            u.maxLife = Math.round(maxLife * 2.5);
            u.life = Math.round(maxLife * 2.5);
            const scale = u.getField(UNIT_RF_SCALING_VALUE);
            if (typeof scale == 'number') {
              u.setScale(1.5 * scale, 1.5 * scale, 1.5 * scale);
            }
            u.name = '|cffffcc00Champion|r ' + u.name;
            value = 2;
          }
          u.setField(
            UNIT_IF_DEFENSE_TYPE,
            defenseTypeIndex(levelInfo.defenseType)
          );
          this.tracker.addCreep(creep(u, value, spawnInfo.moveTarget));
        });
      });
    }
  }
}
