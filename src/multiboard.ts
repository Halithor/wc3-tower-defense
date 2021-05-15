import {GameState} from 'system/gamestate';
import {doAfter, Unit} from 'w3lib/src/index';

export class MultiboardUpdater {
  private readonly board: multiboard;
  constructor(private readonly gameState: GameState) {
    gameState.eventCreepCountChange.subscribe(() => this.updateTitle());

    this.board = CreateMultiboard();
    MultiboardSetRowCount(this.board, 4);
    this.updateTitle();

    doAfter(5, () => {
      MultiboardDisplay(this.board, true);
    });
  }

  private updateTitle() {
    MultiboardSetTitleText(
      this.board,
      `${Math.round(this.gameState.creepCount)} / 120`
    );
  }
}
