import {DefenseType} from 'combattypes';
import {
  doAfter,
  doPeriodically,
  Event,
  Group,
  onAnyUnitDeath,
  Subject,
  Timer,
} from 'w3lib/src/index';
import {CreepSpawning} from './creeps/spawning';
import {GameState} from './gamestate';
import {PlayerSystem} from './players/playerSystem';

const startingDifficulty = 1.0;
const difficultyMultiplier = 1.02;
const difficultyConstant = 1;

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
  WaveFormat.Standard,
  WaveFormat.Standard,
  WaveFormat.Challenge,
  WaveFormat.Challenge,
  WaveFormat.Boss,
  WaveFormat.Mass,
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
  private _level = 1;
  private _waveInfos: WaveInfo[] = [];
  private activeWaves: ActiveWave[] = [];
  private spawning?: {cancel: () => void; timer: Timer};

  private readonly subjectWaveSpawnStart = new Subject<[waveInfo: WaveInfo]>();
  readonly eventWaveSpawnStart: Event<[waveInfo: WaveInfo]> = this
    .subjectWaveSpawnStart;

  get level(): number {
    return this._level;
  }

  get waveInfos(): WaveInfo[] {
    return this._waveInfos;
  }

  constructor(
    readonly spawner: CreepSpawning,
    readonly players: PlayerSystem,
    readonly gameState: GameState
  ) {
    let difficulty = startingDifficulty;
    for (let i = 0; i < 10; i++) {
      this.generateNextWaveInfo();
    }

    doAfter(10, () => {
      this.spawnLevel(this._level, difficulty);
      this.spawning = doPeriodically(45, () => {
        this._level++;
        difficulty = difficulty * difficultyMultiplier + difficultyConstant;

        this.generateNextWaveInfo();
        this.spawnLevel(this._level, difficulty);
      });
    });

    onAnyUnitDeath(dying => {
      for (let i = 0; i < this.activeWaves.length; i++) {
        const w = this.activeWaves[i];
        if (w.group.hasUnit(dying)) {
          w.group.removeUnit(dying);
          if (w.group.size == 0 && w.spawnFinished) {
            // Wave is cleared
            this.activeWaves.splice(i, 1);
            players.waveReward(w.level);
          }
          break;
        }
      }
    });
    gameState.eventDefeat.subscribe(() => {
      if (this.spawning) {
        this.spawning.cancel();
      }
    });
  }

  private generateNextWaveInfo() {
    this._waveInfos[this._waveInfos.length] = this.randomLevelInfo();
  }

  private spawnLevel(level: number, difficulty: number) {
    const info = this._waveInfos[level];
    print(
      `Spawning Level ${level} - ${
        info.defenseType.nameColored
      } ${waveFormatString(info.format)} - (diff: ${string.format(
        '%.2f',
        difficulty
      )})`
    );
    const g = new Group();
    const onSpawnFinish = this.spawner.spawnLevel(difficulty, info, g);
    const wave = new ActiveWave(level, g);
    onSpawnFinish.subscribe(() => (wave.spawnFinished = true));
    this.activeWaves.push(wave);
    this.subjectWaveSpawnStart.emit(info);
  }

  private randomLevelInfo(): WaveInfo {
    return new WaveInfo(
      waveFormatOptions[Math.floor(Math.random() * waveFormatOptions.length)],
      defOptions[Math.floor(Math.random() * defOptions.length)]
    );
  }
}
