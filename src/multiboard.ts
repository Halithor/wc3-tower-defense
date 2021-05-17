import {maxCreepsDefeat} from 'constants';
import {GameState} from 'system/gamestate';
import {waveFormatString, WaveSystem} from 'system/wavesystem';
import {doAfter, Multiboard} from 'w3lib/src/index';

const rowCount = 7;
const colCount = 3;

export class MultiboardUpdater {
  private readonly board: Multiboard;
  constructor(
    private readonly gameState: GameState,
    private readonly waves: WaveSystem
  ) {
    print('new multiboard');

    this.board = new Multiboard();
    this.board.rows = rowCount;
    this.board.cols = colCount;
    this.board.setColWidth(0, 0.045);
    this.board.setColWidth(1, 0.14);
    this.board.setColWidth(2, 0.03);
    this.board.setAllItemsStyle(true, false);
    this.board.item(this.board.rows - 1, 0).text = '|cffffcc00Current|r';
    this.board.item(this.board.rows - 2, 0).text = '|cffffcc00Next|r';
    this.board.item(0, 1).text = '|cffffcc00Wave Type|r';
    this.board.item(0, 2).text = '|cffffcc00Level|r';
    this.updateTitle();

    waves.eventWaveSpawnStart.subscribe(() => {
      this.updateBoard();
      this.updateTitle();
    });
    gameState.eventCreepCountChange.subscribe(() => this.updateTitle());

    doAfter(1, () => {
      this.board.displayed = true;
    });
  }

  private updateBoard(): void {
    this.board
      .column(1)
      .slice(1)
      .forEach((item, idx) => {
        const diff = this.board.rows - idx - 2;
        const level = this.waves.level + diff;
        const wave = this.waves.waveInfos[level];
        item.text = `${wave.defenseType.nameColored} ${waveFormatString(
          wave.format
        )}`;
      });
    this.board
      .column(2)
      .slice(1)
      .forEach((item, idx) => {
        const diff = this.board.rows - idx - 2;
        const level = this.waves.level + diff;
        item.text = `${level}`;
      });
  }

  private updateTitle() {
    const level = `Level ${this.waves.level} - `;
    let color = '|cffffcc00';
    if (this.gameState.creepCount / maxCreepsDefeat > 0.8) {
      color = '|cffcc0000';
    }
    const creeps = `${color}Creeps ${Math.round(
      this.gameState.creepCount
    )} / ${maxCreepsDefeat}`;
    this.board.title = `${level}${creeps}`;
  }
}
