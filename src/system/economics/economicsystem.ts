import {CreepTracker} from 'system/creeps/creeptracker';
import {PlayerSystem} from 'system/players/playerSystem';
import {flashEffect, onAnyUnitDeath} from 'w3lib/src/index';

const goldEffectPath = 'UI\\Feedback\\GoldCredit\\GoldCredit.mdl';

export class EconomicSystem {
  constructor(readonly tracker: CreepTracker, readonly players: PlayerSystem) {
    onAnyUnitDeath(dying => {
      const creep = tracker.getCreep(dying);
      if (creep) {
        const value = creep.pointValue;
        players.giveGold(value, dying.pos);
        flashEffect(goldEffectPath, dying.pos);
      }
    });
  }
}
