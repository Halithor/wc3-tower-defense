import {playerHumans, UnitIds} from 'constants';
import {PlayerSystem} from 'system/players/playerSystem';
import {
  degrees,
  doAfter,
  Event,
  FogModifier,
  forUnitsInRect,
  Group,
  onAnyUnitSellUnit,
  Rectangle,
  Timer,
  TimerDialog,
  Unit,
} from 'w3lib/src/index';
import {builderClassInfo} from './classInfo';

const classGoldCost = 25;
const builderOptions = [
  UnitIds.builderWarrior,
  UnitIds.builderDruid,
  UnitIds.builderSorceress,
  UnitIds.builderEngineer,
  UnitIds.builderGravedigger,
  UnitIds.builderNorthern,
];

export class ClassSelection {
  eventComplete: Event<[]>;
  eventPlayerSelect: Event<[]>;
  private visions: FogModifier[] = [];
  timerDialog: TimerDialog;
  private hasSelected: {[key: number]: boolean} = {};
  timeLimit: {cancel: () => void; timer: Timer};

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
      this.hasSelected[p.id] = false;
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
      this.hasSelected[sold.owner.id] = true;
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
      const classInfo = builderClassInfo(sold);
      if (!classInfo) {
        return;
      }
      playerSystem.selectClass(sold.owner, classInfo);
      if (playersSelected >= playersInGame) {
        this.completeSelection();
      }
    });

    // Add time limit
    this.timeLimit = doAfter(60, () => {
      playerHumans.forEach(p => {
        if (!p.isIngame()) {
          return;
        }
        if (this.hasSelected[p.id]) {
          return;
        }
        const randomBuilderId =
          builderOptions[Math.floor(Math.random() * builderOptions.length)];
        const builder = new Unit(
          p,
          randomBuilderId,
          playArea.center,
          degrees(0)
        );
        p.selectUnitSingle(builder);
        SetCameraPositionForPlayer(
          p.handle,
          playArea.center.x,
          playArea.center.y
        );
        const classInfo = builderClassInfo(builder);
        if (!classInfo) {
          return;
        }
        playerSystem.selectClass(p, classInfo);
      });
      this.completeSelection();
    });
    this.timerDialog = new TimerDialog(this.timeLimit.timer);
    this.timerDialog.setTitle('Class Selection');
    this.timerDialog.display = true;
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
    this.timeLimit.cancel();
    this.timerDialog.destroy();
  }
}
