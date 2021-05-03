import {Unit} from 'w3lib/src/index';
import {towerCategories, TowerCategories} from './towerconstants';
import {TowerMods} from './towermods';
import {TowerStats} from './towerstats';

// TowerInfo contains the statistics for a give tower.
export class TowerInfo {
  private upgradeStats: TowerStats = TowerStats.empty();
  private _classStats: TowerStats = TowerStats.empty();
  private upgradeGoldValue = 0;
  private _damageDealt = 0;

  readonly mods: TowerMods;

  constructor(
    readonly tower: Unit,
    readonly baseStats: TowerStats,
    private _goldValue: number
  ) {
    this.mods = new TowerMods(tower);
    this.mods.change.subscribe(() => this.expressStats());

    this.expressStats();
  }

  private expressStats() {
    this.stats.express(this.tower);
  }

  addUpgradeStats(stats: TowerStats, goldValue: number) {
    this.upgradeGoldValue += goldValue;
    this.upgradeStats = this.upgradeStats.merge(stats);
    this.expressStats();
  }

  set classStats(stats: TowerStats) {
    this._classStats = stats;
    this.expressStats();
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
    let merged = this.baseStats
      .merge(this._classStats)
      .integratePercentages()
      .merge(this.upgradeStats)
      .integratePercentages();
    merged = merged.merge(this.mods.stats());
    return merged;
  }

  get damageDealt(): number {
    return this._damageDealt;
  }

  addDamageDealt(value: number) {
    this._damageDealt += value;
  }

  get categories(): TowerCategories[] {
    return towerCategories(this.tower.typeId);
  }
}
