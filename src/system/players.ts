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
import {ClassInfo} from './class/classInfo';

const startingGold = 50;
const startingFood = 7;

const waveFoodReward = 3;

export class PlayerSystem {
  private goldFraction = 0;
  private players: MapPlayer[] = [];

  constructor() {
    for (let i = 0; i < 6; i++) {
      const p = Players[i];
      if (!p.isIngame()) {
        continue;
      }
      this.players.push(p);
      p.setAbilityAvailable(SpellIds.allowTowerTurning, false);
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

  selectClass(player: MapPlayer, classInfo: ClassInfo) {
    player.gold = startingGold;
    player.foodCap = startingFood;
    const fog = FogModifier.fromRect(
      player,
      FOG_OF_WAR_VISIBLE,
      Rectangle.fromHandle(gg_rct_PlayArea),
      true,
      true
    );
    fog.start();
  }
}
