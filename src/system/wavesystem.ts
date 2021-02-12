import {DefenseType} from 'combattypes';
import {doAfter, doPeriodically, Group, onAnyUnitDeath} from 'w3lib/src/index';
import {CreepSpawning} from './creeps/spawning';
import {PlayerSystem} from './players';

const defOptions = [
  DefenseType.Flesh,
  DefenseType.Unclean,
  DefenseType.Elemental,
  DefenseType.Natural,
  DefenseType.Construct,
  DefenseType.Demonic,
  DefenseType.Mystical,
];

export enum WaveFormat {
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

export function waveFormatString(format: WaveFormat): string {
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

export class WaveInfo {
  constructor(readonly format: WaveFormat, readonly defenseType: DefenseType) {}
}

class ActiveWave {
  public spawnFinished = false;
  constructor(readonly level: number, readonly group: Group) {}
}

export class WaveSystem {
  private waves: ActiveWave[] = [];

  constructor(readonly spawner: CreepSpawning, readonly players: PlayerSystem) {
    let difficulty = 1;
    let level = 1;
    doAfter(10, () => {
      this.spawnLevel(level, difficulty);
      doPeriodically(45, () => {
        level++;
        difficulty = difficulty * 1.01 + 1;
        this.spawnLevel(level, difficulty);
      });
    });

    onAnyUnitDeath(dying => {
      for (let i = 0; i < this.waves.length; i++) {
        const w = this.waves[i];
        if (w.group.hasUnit(dying)) {
          w.group.removeUnit(dying);
          if (w.group.size == 0 && w.spawnFinished) {
            // Wave is cleared
            this.waves.splice(i, 1);
            players.waveReward(w.level);
          }
          break;
        }
      }
    });
  }

  private spawnLevel(level: number, difficulty: number) {
    print(`Spawning Level ${level}`);
    const g = new Group();
    const onSpawnFinish = this.spawner.spawnLevel(
      difficulty,
      this.randomLevelInfo(),
      g
    );
    const wave = new ActiveWave(level, g);
    onSpawnFinish.listen(() => (wave.spawnFinished = true));
    this.waves.push(wave);
  }

  private randomLevelInfo(): WaveInfo {
    return new WaveInfo(
      waveFormatOptions[Math.floor(Math.random() * waveFormatOptions.length)],
      defOptions[Math.floor(Math.random() * defOptions.length)]
    );
  }
}
