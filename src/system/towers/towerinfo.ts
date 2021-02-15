import {Unit} from 'w3lib/src/index';
import {TowerStats} from './towerstats';

// TowerInfo contains the statistics for a give tower.
export class TowerInfo {
  readonly statMods: TowerStats[] = [];
  private upgradeStats: TowerStats;

  constructor(
    readonly tower: Unit,
    readonly baseStats: TowerStats,
    private _goldValue: number
  ) {
    this.upgradeStats = TowerStats.empty();

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
    // Start with the base stats + upgrades as an integrated set of base values
    let merged = this.baseStats.merge(this.upgradeStats).integratePercentages();

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

  addUpgradeStats(stats: TowerStats) {
    this.upgradeStats = this.upgradeStats.merge(stats);
    this.applyStats();
  }

  // upgradeInto moves important information from one tower to another, as in an upgrade.
  upgradeInto(other: TowerInfo) {
    other.addStatMods(...this.statMods)
    other.addUpgradeStats(this.upgradeStats)
  }

  get goldValue(): number {
    return this._goldValue;
  }
}
