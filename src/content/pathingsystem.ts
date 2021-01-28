import {KeepPath} from 'lib/keeppath';
import {
  color,
  doPeriodically,
  doPeriodicallyCounted,
  onAnyUnitEntersRegion,
  playerColors,
  Rectangle,
  Region,
  unitId,
} from 'w3lib/src/index';

export class PathingSystem {
  private spawn0Keeper: KeepPath;
  private spawn1Keeper: KeepPath;
  private keeper0: KeepPath;
  private keeper1: KeepPath;
  private keeper2: KeepPath;
  private keeper3: KeepPath;
  private keeper4: KeepPath;
  private keeper5: KeepPath;

  constructor() {
    const spawn0 = Rectangle.fromHandle(gg_rct_Spawn0).center;
    const spawn1 = Rectangle.fromHandle(gg_rct_Spawn1).center;
    const check0 = Rectangle.fromHandle(gg_rct_Check0).center;
    const check1 = Rectangle.fromHandle(gg_rct_Check1).center;
    const check2 = Rectangle.fromHandle(gg_rct_Check2).center;
    const check3 = Rectangle.fromHandle(gg_rct_Check3).center;
    const check4 = Rectangle.fromHandle(gg_rct_Check4).center;
    const check5 = Rectangle.fromHandle(gg_rct_Check5).center;

    this.spawn0Keeper = new KeepPath(spawn0, check3, playerColors[21]);
    this.spawn1Keeper = new KeepPath(spawn1, check0, playerColors[21]);
    this.keeper0 = new KeepPath(check0, check1, playerColors[1]);
    this.keeper1 = new KeepPath(check1, check2, playerColors[2]);
    this.keeper2 = new KeepPath(check2, check3, playerColors[3]);
    this.keeper3 = new KeepPath(check3, check4, playerColors[4]);
    this.keeper4 = new KeepPath(check4, check5, playerColors[5]);
    this.keeper5 = new KeepPath(check5, check0, playerColors[6]);

    // doPeriodically(10, () => {
    //   this.spawn0Keeper.flashPath();
    //   this.spawn1Keeper.flashPath();
    //   this.keeper0.flashPath();
    //   this.keeper1.flashPath();
    //   this.keeper2.flashPath();
    //   this.keeper3.flashPath();
    //   this.keeper4.flashPath();
    //   this.keeper5.flashPath();
    // });
    onAnyUnitEntersRegion(Region.fromRect(gg_rct_Check0), u => {
      if (u.typeId == unitId('hpea')) {
        return;
      }
      u.issueOrderAt('move', check1);
    });
    onAnyUnitEntersRegion(Region.fromRect(gg_rct_Check1), u => {
      if (u.typeId == unitId('hpea')) {
        return;
      }
      u.issueOrderAt('move', check2);
    });
    onAnyUnitEntersRegion(Region.fromRect(gg_rct_Check2), u => {
      if (u.typeId == unitId('hpea')) {
        return;
      }
      u.issueOrderAt('move', check3);
    });
    onAnyUnitEntersRegion(Region.fromRect(gg_rct_Check3), u => {
      if (u.typeId == unitId('hpea')) {
        return;
      }
      u.issueOrderAt('move', check4);
    });
    onAnyUnitEntersRegion(Region.fromRect(gg_rct_Check4), u => {
      if (u.typeId == unitId('hpea')) {
        return;
      }
      u.issueOrderAt('move', check5);
    });
    onAnyUnitEntersRegion(Region.fromRect(gg_rct_Check5), u => {
      if (u.typeId == unitId('hpea')) {
        return;
      }
      u.issueOrderAt('move', check0);
    });

    doPeriodically(5, () => {
      const totalLength =
        this.keeper0.length +
        this.keeper1.length +
        this.keeper2.length +
        this.keeper3.length +
        this.keeper4.length +
        this.keeper5.length;
      print(`Maze length: ${totalLength}`);
    });
  }
}
