import {onAnyUnitDecay, Unit} from 'w3lib/src/index';
import {Creep} from './creep';

// CreepTracker handles keeping track of living creeps and removing them as they die.
class CreepTracker {
  private creeps: {[key: number]: Creep} = {};

  setup() {
    onAnyUnitDecay(u => {
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

export const creepTracker = new CreepTracker();
