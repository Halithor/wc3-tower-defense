import {UnitIds} from 'constants';
import {onAnyUnitTrainingFinish} from 'w3lib/src/index';
import {isUnitTower} from './towerconstants';
import {TowerTracker} from './towertracker';

export class TowerSellingSystem {
  constructor(readonly towerTracker: TowerTracker) {
    onAnyUnitTrainingFinish((trained, trainer) => {
      if (trained.typeId.equals(UnitIds.sellTower) && isUnitTower(trainer)) {
        const info = towerTracker.getTower(trainer);
        if (!info) {
          return;
        }

        const goldValue = info.goldValue;
        trainer.owner.gold += goldValue;
        trainer.destroy();
        trained.destroy();
        towerTracker.removeTower(trainer);
        DisplayTimedTextToPlayer(
          trainer.owner.handle,
          0,
          0,
          10,
          `Sold |cff6699FF${trainer.name}|r for |cffffcc00${goldValue} gold|r.`
        );
      }
    });
  }
}
