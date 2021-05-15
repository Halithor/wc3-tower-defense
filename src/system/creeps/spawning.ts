import {DefenseType} from 'combattypes';
import {getPlayerCount, playerEnemies} from 'constants';
import {GameState} from 'system/gamestate';
import {SpawnInfo} from 'system/pathinfo';
import {WaveFormat, WaveInfo} from 'system/wavesystem';
import {
  Unit,
  doPeriodicallyCounted,
  doAfter,
  Group,
  Subject,
  UnitId,
  Timer,
} from 'w3lib/src/index';
import {creep} from './creep';
import {CreepIds} from './creepids';
import {creepTracker} from './creeptracker';

const movespeed = (difficulty: number) => Math.round(240 + difficulty);
const maxLife = (difficulty: number) =>
  Math.round(16 * difficulty * getPlayerCount());
const armor = (difficulty: number) => Math.floor(difficulty / 2) + 1;

const standardValue = 1;
const bossValue = 10;
const massValue = 0.5;
const challengeValue = 2;

const standardIntervalDistance = 128;
const standardCount = 10;

const bossLifeFactor = 10;
const bossArmorFactor = 2;
const bossMovespeedFactor = 0.8;
const bossVisualScale = 2.5;

const massIntervalDistance = 64;
const massCount = 20;
const massLifeFactor = 0.6;
const massArmorFactor = 0.6;
const massMovespeedFactor = 0.9;
const massVisualScale = 0.8;

const challengeIntervalDistance = 192;
const challengeLifeFactor = 2.5;
const challengeArmorFactor = 2.0;
const challengeVisualScale = 1.5;

export class CreepSpawning {
  private currentSpawning?: {cancel: () => void; timer: Timer};
  constructor(private spawns: SpawnInfo[], readonly gameState: GameState) {
    gameState.eventDefeat.subscribe(() => {
      if (this.currentSpawning) {
        this.currentSpawning.cancel();
      }
    });
  }

  spawnLevel(
    difficulty: number,
    waveInfo: WaveInfo,
    group: Group
  ): Subject<[]> {
    const uid = CreepIds.list[Math.floor(Math.random() * CreepIds.list.length)];
    switch (waveInfo.format) {
      case WaveFormat.Standard:
        return this.standardLevel(difficulty, waveInfo, group, uid);
      case WaveFormat.Boss:
        return this.bossLevel(difficulty, waveInfo, group, uid);
      case WaveFormat.Mass:
        return this.massLevel(difficulty, waveInfo, group, uid);
      case WaveFormat.Challenge:
        return this.challengeLevel(difficulty, waveInfo, group, uid);
      default:
        const _checkExhaustive: never = waveInfo.format;
        throw new Error('should not happen');
    }
  }

  private spawnSet(
    waveGroup: Group,
    uid: UnitId,
    life: number,
    armor: number,
    movespeed: number,
    defense: DefenseType,
    value: number,
    visualScale: number = 1.0,
    nameChanger?: (name: string) => string
  ) {
    this.spawns.forEach((spawnInfo, idx) => {
      const u = new Unit(
        playerEnemies[idx % 2],
        uid,
        spawnInfo.spawn.center,
        spawnInfo.spawn.center.angleTo(spawnInfo.moveTarget.center)
      );
      u.removeGuardPosition();
      u.issueOrderAt('move', spawnInfo.moveTarget.center);
      u.maxLife = life;
      u.life = life;
      u.armor = armor;
      u.moveSpeed = movespeed;
      u.setField(UNIT_IF_DEFENSE_TYPE, defense.index);
      const scale = u.getField(UNIT_RF_SCALING_VALUE);
      if (typeof scale == 'number') {
        u.setScale(
          visualScale * scale,
          visualScale * scale,
          visualScale * scale
        );
      }
      if (nameChanger) {
        u.name = nameChanger(u.name);
      }
      waveGroup.addUnit(u);
      creepTracker.addCreep(creep(u, value, spawnInfo.moveTarget));
    });
  }

  private standardLevel(
    difficulty: number,
    waveInfo: WaveInfo,
    waveGroup: Group,
    uid: UnitId
  ): Subject<[]> {
    const event = new Subject<[]>();
    const life = maxLife(difficulty);
    const arm = armor(difficulty);
    const speed = movespeed(difficulty);
    const interval = standardIntervalDistance / speed;
    this.currentSpawning = doPeriodicallyCounted(
      interval,
      standardCount,
      () => {
        this.spawnSet(
          waveGroup,
          uid,
          life,
          arm,
          speed,
          waveInfo.defenseType,
          standardValue
        );
      },
      () => event.emit()
    );
    return event;
  }

  private bossLevel(
    difficulty: number,
    waveInfo: WaveInfo,
    waveGroup: Group,
    uid: UnitId
  ): Subject<[]> {
    const event = new Subject<[]>();
    this.spawnSet(
      waveGroup,
      uid,
      Math.round(maxLife(difficulty) * bossLifeFactor),
      Math.round(armor(difficulty) * bossArmorFactor),
      Math.round(movespeed(difficulty) * bossMovespeedFactor),
      waveInfo.defenseType,
      bossValue,
      bossVisualScale,
      name => `The Strongest ${name}`
    );
    // Delay event firing so that subscribers can sub.
    doAfter(0.5, () => event.emit());
    return event;
  }

  private massLevel(
    difficulty: number,
    waveInfo: WaveInfo,
    waveGroup: Group,
    uid: UnitId
  ): Subject<[]> {
    const event = new Subject<[]>();
    const life = Math.round(maxLife(difficulty) * massLifeFactor);
    const arm = Math.round(armor(difficulty) * massArmorFactor);
    const speed = Math.round(movespeed(difficulty) * massMovespeedFactor);
    const interval = massIntervalDistance / speed;
    this.currentSpawning = doPeriodicallyCounted(
      interval,
      massCount,
      () => {
        this.spawnSet(
          waveGroup,
          uid,
          life,
          arm,
          speed,
          waveInfo.defenseType,
          massValue,
          massVisualScale,
          name => `${name} Mass`
        );
      },
      () => event.emit()
    );
    return event;
  }

  private challengeLevel(
    difficulty: number,
    waveInfo: WaveInfo,
    waveGroup: Group,
    uid: UnitId
  ): Subject<[]> {
    const event = new Subject<[]>();
    const life = maxLife(difficulty);
    const arm = armor(difficulty);
    const speed = movespeed(difficulty);
    const interval = challengeIntervalDistance / speed;

    this.currentSpawning = doPeriodicallyCounted(
      interval,
      7,
      (_cancel, creepIndex) => {
        if (creepIndex === 1 || creepIndex === 3 || creepIndex === 5) {
          this.spawnSet(
            waveGroup,
            uid,
            Math.round(life * challengeLifeFactor),
            Math.round(arm * challengeArmorFactor),
            speed,
            waveInfo.defenseType,
            challengeValue,
            challengeVisualScale,
            name => `|cffffcc00Champion|r ${name}`
          );
        } else {
          this.spawnSet(
            waveGroup,
            uid,
            life,
            arm,
            speed,
            waveInfo.defenseType,
            standardValue
          );
        }
      },
      () => event.emit()
    );
    return event;
  }
}
