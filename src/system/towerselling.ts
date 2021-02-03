import {UnitIds} from 'constants';
import {onAnyUnitTrainingFinish, Trigger} from 'w3lib/src/index';

export class TowerSellingSystem {
  constructor() {
    onAnyUnitTrainingFinish((trained, trainer) => {
      if (trained.typeId.equals(UnitIds.sellTower)) {
        // TODO return gold
        const goldValue = 0;
        trainer.owner.gold += goldValue;
        trainer.destroy();
        trained.destroy();
        DisplayTimedTextToPlayer(
          trainer.owner.handle,
          0,
          0,
          5,
          `|cffffcc00Sold ${trainer.name} for ${goldValue} gold.|r`
        );
      }
    });
  }
}
