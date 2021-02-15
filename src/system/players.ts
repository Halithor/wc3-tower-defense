import {SpellIds, UnitIds} from 'constants';
import {
  createGoldBountyTextTag,
  degrees,
  FogModifier,
  MapPlayer,
  onAnyPlayerLeaves,
  Players,
  Rectangle,
  Unit,
  Vec2,
} from 'w3lib/src/index';

const startingGold = 50;
const startingFood = 7;

const waveFoodReward = 3;

export class PlayerSystem {
  private goldFraction = 0;
  private players: MapPlayer[] = [];

  constructor() {
    const playArea = Rectangle.fromHandle(gg_rct_PlayArea);
    for (let i = 0; i < 6; i++) {
      const p = Players[i];
      if (!p.isIngame()) {
        continue;
      }
      this.players.push(p);
      p.gold = startingGold;
      p.foodCap = startingFood;

      const fog = FogModifier.fromRect(
        p,
        FOG_OF_WAR_VISIBLE,
        playArea,
        true,
        true
      );
      fog.start();
      p.setAbilityAvailable(SpellIds.allowTowerTurning, false);
      const builder = new Unit(
        p,
        UnitIds.builderPaladin,
        playArea.center,
        degrees(270)
      );
      p.selectUnitSingle(builder);
      SetCameraPositionForPlayer(
        p.handle,
        playArea.center.x,
        playArea.center.y
      );
    }
    onAnyPlayerLeaves(leaving => {
      const idx = this.players.indexOf(leaving);
      if (idx > -1) {
        this.players.splice(idx, 1);
      }
    });
  }

  giveGold(amount: number, pos: Vec2) {
    const tt = createGoldBountyTextTag(pos, amount);
    this.goldFraction += amount;
    const floored = Math.floor(this.goldFraction);
    if (floored > 0) {
      this.goldFraction -= floored;
    }
    this.players.forEach(p => {
      p.gold += floored;
      tt.setVisibleForPlayer(p, true);
    });
  }

  waveReward(waveNumber: number) {
    this.players.forEach(p => {
      p.foodCap += waveFoodReward;
      DisplayTimedTextToPlayer(
        p.handle,
        0,
        0,
        10,
        `Wave ${waveNumber} Cleared!\n|cffaaaaaaYou have gained ${waveFoodReward} max food.|r`
      );
    });
  }
}