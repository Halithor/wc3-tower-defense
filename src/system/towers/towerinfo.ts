import {Unit} from 'w3lib/src/index';
import {TowerStats} from './towerstats';

// TowerInfo contains the statistics for a give tower.
export class TowerInfo {
  private upgradeStats: TowerStats;
  private upgradeGoldValue = 0;
  constructor(
    readonly tower: Unit,
    readonly baseStats: TowerStats,
    private _goldValue: number
  ) {
    this.upgradeStats = TowerStats.empty();

    this.applyStats();
  }

  private applyStats() {
    this.stats.express(this.tower);
  }

  addUpgradeStats(stats: TowerStats, goldValue: number) {
    this.upgradeGoldValue += goldValue;
    this.upgradeStats = this.upgradeStats.merge(stats);
    this.applyStats();
  }

  // moveInfoTo moves important information from one tower to another, as in an upgrade.
  moveInfoTo(other: TowerInfo) {
    other.addUpgradeStats(this.upgradeStats, this.upgradeGoldValue);
  }

  get goldValue(): number {
    return this._goldValue + this.upgradeGoldValue;
  }

  get stats(): TowerStats {
    // Start with the base stats + upgrades as an integrated set of base values
    let merged = this.baseStats.merge(this.upgradeStats).integratePercentages();
    return merged;
  }
}
