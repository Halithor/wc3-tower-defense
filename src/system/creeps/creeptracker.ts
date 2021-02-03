import {eventAnyUnitDies, Rectangle, Unit, unitId} from 'w3lib/src/index';
import {Creep} from './creep';

// CreepTracker handles keeping track of living creeps and removing them as they die.
export class CreepTracker {
  private creeps: {[key: number]: Creep} = {};
  constructor() {
    eventAnyUnitDies.listen(u => {
      if (u.id in this.creeps) {
        delete this.creeps[u.id];
      }
    });
  }

  addCreep(creep: Creep) {
    this.creeps[creep.unit.id] = creep;
  }

  getCreep(unit: Unit): Creep | undefined {
    if (unit.id in this.creeps) {
      return this.creeps[unit.id];
    }
    return undefined;
  }
}
