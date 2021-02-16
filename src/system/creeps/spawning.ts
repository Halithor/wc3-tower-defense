import {DefenseType, defenseTypeIndex, defenseTypeString} from 'combattypes';
import {getPlayerCount, playerEnemies} from 'constants';
import {SpawnInfo} from 'system/pathinfo';
import {WaveFormat, waveFormatString, WaveInfo} from 'system/wavesystem';
import {
  unitId,
  Unit,
  degrees,
  doPeriodicallyCounted,
  doAfter,
  doPeriodically,
  Group,
  Event,
} from 'w3lib/src/index';
import {creep} from './creep';
import {CreepIds} from './creepids';
import {CreepTracker} from './creeptracker';

export class CreepSpawning {
  constructor(
    private readonly tracker: CreepTracker,
    private spawns: SpawnInfo[]
  ) {}

  spawnLevel(difficulty: number, levelInfo: WaveInfo, group: Group): Event<[]> {
    const spawnFinishedEvent = new Event<[]>();
    const maxLife = Math.round(12 * difficulty * getPlayerCount());
    const armor = Math.floor(difficulty / 2) + 1;
    const movespeed = Math.round(240 + difficulty);

    const uid = CreepIds.list[Math.floor(Math.random() * CreepIds.list.length)];
    print(
      `${waveFormatString(
        levelInfo.format
      )}@${difficulty} w/ ${defenseTypeString(
        levelInfo.defenseType
      )} defense / ${maxLife} life / ${armor} armor / ${movespeed} ms`
    );
    if (levelInfo.format == WaveFormat.Standard) {
      doPeriodicallyCounted(
        1.0,
        10,
        () => {
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
            group.addUnit(u);
            this.tracker.addCreep(creep(u, 1, spawnInfo.moveTarget));
          });
        },
        () => spawnFinishedEvent.fire()
      );
    } else if (levelInfo.format == WaveFormat.Boss) {
      this.spawns.forEach(
        (spawnInfo, idx) => {
          const u = new Unit(
            playerEnemies[idx % 2],
            uid,
            spawnInfo.spawn.center,
            spawnInfo.spawn.center.angleTo(spawnInfo.moveTarget.center)
          );
          u.removeGuardPosition();
          u.issueOrderAt('move', spawnInfo.moveTarget.center);
          u.maxLife = maxLife * 10;
          u.life = maxLife * 10;
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
          group.addUnit(u);
          this.tracker.addCreep(creep(u, 10, spawnInfo.moveTarget));
        },
        () => spawnFinishedEvent.fire()
      );
    } else if (levelInfo.format == WaveFormat.Mass) {
      doPeriodicallyCounted(
        0.4,
        20,
        () => {
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
            const scale = u.getField(UNIT_RF_SCALING_VALUE);
            if (typeof scale == 'number') {
              u.setScale(0.8 * scale, 0.8 * scale, 0.8 * scale);
            }
            u.name = u.name + ' Mass';
            u.setField(
              UNIT_IF_DEFENSE_TYPE,
              defenseTypeIndex(levelInfo.defenseType)
            );
            group.addUnit(u);
            this.tracker.addCreep(creep(u, 0.5, spawnInfo.moveTarget));
          });
        },
        () => spawnFinishedEvent.fire()
      );
    } else if (levelInfo.format == WaveFormat.Challenge) {
      doPeriodicallyCounted(
        1.2,
        7,
        (_cancel, creepIndex) => {
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
              u.armor = armor * 2;
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
            group.addUnit(u);
            this.tracker.addCreep(creep(u, value, spawnInfo.moveTarget));
          });
        },
        () => spawnFinishedEvent.fire()
      );
    }
    return spawnFinishedEvent;
  }
}
