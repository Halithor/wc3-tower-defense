import {maxCreepsDefeat} from 'constants';
import {
  Event,
  eventAnyUnitDeath,
  forUnitsInRect,
  Rectangle,
  Subject,
} from 'w3lib/src/index';
import {creepTracker} from './creeps/creeptracker';

export class GameState {
  private defeated = false;
  private _creepCount = 0;
  private readonly subjectCreepCountChange = new Subject<[count: number]>();
  readonly eventCreepCountChange: Event<[count: number]> = this
    .subjectCreepCountChange;

  private readonly subjectDefeat = new Subject<[]>();
  readonly eventDefeat: Event<[]> = this.subjectDefeat;

  cheatDeath = false;

  constructor() {
    creepTracker.eventCreepSpawn.subscribe(creep => {
      this._creepCount += creep.pointValue;
      this.subjectCreepCountChange.emit(this.creepCount);
      this.checkDefeat();
    });
    eventAnyUnitDeath.subscribe(u => {
      const creep = creepTracker.getCreep(u);
      if (!creep) {
        return;
      }
      this._creepCount -= creep.pointValue;
      this.subjectCreepCountChange.emit(this.creepCount);
    });
  }

  checkDefeat() {
    if (
      this.creepCount > maxCreepsDefeat &&
      !this.defeated &&
      !this.cheatDeath
    ) {
      this.defeated = true;
      this.subjectDefeat.emit();
      print(
        '|cffffcc00 ====== Game over ======|r\nToo many creeps alive on the map. Better luck next time!'
      );
      forUnitsInRect(Rectangle.fromHandle(GetPlayableMapRect()), u => {
        u.paused = true;
      });
    }
  }

  get creepCount() {
    return this._creepCount;
  }
}
