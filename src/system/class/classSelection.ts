import {playerHumans, UnitIds} from 'constants';
import {PlayerSystem} from 'system/players';
import {
  degrees,
  Event,
  FogModifier,
  forUnitsInRect,
  Group,
  onAnyUnitSellUnit,
  Rectangle,
  Unit,
} from 'w3lib/src/index';

const classGoldCost = 25;

export class ClassSelection {
  eventComplete: Event<[]>;
  eventPlayerSelect: Event<[]>;
  private visions: FogModifier[] = [];

  constructor(playerSystem: PlayerSystem) {
    this.eventComplete = new Event<[]>();
    this.eventPlayerSelect = new Event<[]>();

    const selectionArea = Rectangle.fromHandle(gg_rct_ClassSelection);
    const playArea = Rectangle.fromHandle(gg_rct_PlayArea);

    // Find the Tavern
    let tavern: Unit | undefined;
    forUnitsInRect(selectionArea, u => {
      if (u.typeId.equals(UnitIds.classTavern)) {
        tavern = u;
      }
    });

    let playersInGame = 0;
    playerHumans.forEach(p => {
      if (!p.isIngame()) {
        return;
      }
      p.gold = classGoldCost;
      new Unit(p, UnitIds.classPurchaser, selectionArea.center, degrees(270));
      playersInGame++;
      const vision = FogModifier.fromRect(
        p,
        FOG_OF_WAR_VISIBLE,
        selectionArea,
        true,
        true
      );
      vision.start();
      this.visions.push(vision);
      SetCameraPositionForPlayer(
        p.handle,
        selectionArea.center.x,
        selectionArea.center.y
      );
      if (tavern) {
        p.selectUnitSingle(tavern);
      }
    });

    let playersSelected = 0;
    onAnyUnitSellUnit((sold, seller) => {
      if (!seller.typeId.equals(UnitIds.classTavern)) {
        return;
      }
      playersSelected++;
      sold.pos = playArea.center;
      sold.owner.selectUnitSingle(sold);
      SetCameraPositionForPlayer(
        sold.owner.handle,
        playArea.center.x,
        playArea.center.y
      );
      forUnitsInRect(selectionArea, u => {
        if (u.owner == sold.owner) {
          u.destroy();
        }
      });
      playerSystem.selectClass(sold.owner);
      if (playersSelected >= playersInGame) {
        this.completeSelection();
      }
    });
  }

  private completeSelection() {
    print('=== Class selection complete! ===');
    const selectionArea = Rectangle.fromHandle(gg_rct_ClassSelection);
    forUnitsInRect(selectionArea, u => {
      u.destroy();
    });
    this.eventComplete.fire();
    this.visions.forEach(v => {
      v.destroy();
    });
  }
}
