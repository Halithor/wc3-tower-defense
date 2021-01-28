import {playerEnemies1, playerEnemies2} from 'constants';
import {
  degrees,
  doPeriodically,
  Rectangle,
  Unit,
  unitId,
  Vec2,
} from 'w3lib/src/index';

export class SpawnSystem {
  spawn0: Vec2;
  spawn1: Vec2;
  spawn1Target: Vec2;
  spawn0Target: Vec2;

  constructor() {
    this.spawn0 = Rectangle.fromHandle(gg_rct_Spawn0).center;
    this.spawn1 = Rectangle.fromHandle(gg_rct_Spawn1).center;
    this.spawn0Target = Rectangle.fromHandle(gg_rct_Check3).center;
    this.spawn1Target = Rectangle.fromHandle(gg_rct_Check0).center;

    doPeriodically(4, () => this.spawn());
  }

  private spawn() {
    BlzSetAbilityIntegerField;
    const u1 = new Unit(
      playerEnemies1,
      unitId('n000'),
      this.spawn0,
      degrees(270)
    );
    u1.removeGuardPosition();
    u1.applyTimedLife(FourCC('BHwe'), 60);
    u1.issueOrderAt('move', this.spawn0Target);
    const u2 = new Unit(
      playerEnemies2,
      unitId('n000'),
      this.spawn1,
      degrees(0)
    );
    u2.removeGuardPosition();
    u2.applyTimedLife(FourCC('BHwe'), 60);
    u2.issueOrderAt('move', this.spawn1Target);
    GetItemTypeId(GetManipulatedItem());
  }
}
