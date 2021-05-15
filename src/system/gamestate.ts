import {Event, eventAnyUnitDeath, Subject} from 'w3lib/src/index';
import {creepTracker} from './creeps/creeptracker';

export class GameState {
  private _creepCount = 0;
  private readonly subjectCreepCountChange = new Subject<[count: number]>();
  readonly eventCreepCountChange: Event<[count: number]> = this
    .subjectCreepCountChange;

  constructor() {
    creepTracker.eventCreepSpawn.subscribe(creep => {
      this._creepCount += creep.pointValue;
      this.subjectCreepCountChange.emit(this.creepCount);
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

  get creepCount() {
    return this._creepCount;
  }
}
