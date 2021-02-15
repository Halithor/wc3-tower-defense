import {Unit} from 'w3lib/src/index';
import {TowerStats} from './towerstats';

// TowerInfo contains the statistics for a give tower.
export class TowerInfo {
  readonly statMods: TowerStats[] = [];
  constructor(
    readonly tower: Unit,
    readonly baseStats: TowerStats,
    readonly _goldValue: number
  ) {
    this.applyStats();
  }

  addStatMods(...stats: TowerStats[]) {
    this.statMods.push(...stats);
    this.applyStats();
  }

  removeStatMod(stats: TowerStats) {
    this.statMods.splice(this.statMods.indexOf(stats), 1);
    this.applyStats();
  }

  private applyStats() {
    let merged = this.baseStats;
    this.statMods.forEach(mod => {
      merged = merged.merge(mod);
      print(`Merged as:\n${merged.toString()}`);
    });
    print(
      `|cffffcc00Expressing ${this.tower.name} as|r:\n${merged.toString()}`
    );
    merged.express(this.tower);
    print('express finish');
  }

  get goldValue(): number {
    return this._goldValue;
  }
}
