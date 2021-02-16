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
    this.stats.express(this.tower);
  }

  addUpgradeStats(stats: TowerStats) {
    this.upgradeStats = this.upgradeStats.merge(stats);
    this.applyStats();
  }

  // upgradeInto moves important information from one tower to another, as in an upgrade.
  upgradeInto(other: TowerInfo) {
    other.addStatMods(...this.statMods);
    other.addUpgradeStats(this.upgradeStats);
  }

  get goldValue(): number {
    return this._goldValue;
  }

  get stats(): TowerStats {
    print(
      `Stats w/ Base:\n${this.baseStats.toString()}\nand upgrades:\n ${this.upgradeStats.toString()}`
    );
    // Start with the base stats + upgrades as an integrated set of base values
    let merged = this.baseStats.merge(this.upgradeStats).integratePercentages();

    print(`merged:\n${merged.toString()}`);
    this.statMods.forEach(mod => {
      merged = merged.merge(mod);
    });
    return merged;
  }
}
