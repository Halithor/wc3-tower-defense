import {AttackType} from 'combattypes';
import {playerHumans, SpellIds, UnitIds} from 'constants';
import {CircleIndicator} from 'lib/indicator';
import {eventAnyDamaging} from 'system/damage';
import {
  degrees,
  doAfter,
  onAnyUnitConstructionFinish,
  onAnyUnitDamaged,
  onAnyUnitSpellEffect,
  onAnyUnitUpgradeFinish,
  standardTextTag,
} from 'w3lib/src/index';
import {SpellTowerEffects} from './spelltowers';
import {TowerSellingSystem} from './towerselling';
import {towerTracker} from './towertracker';
import {TowerUpgrades} from './towerupgrades';

export class TowerSystem {
  constructor() {
    this.removeRallyAbilityOnTowers();

    const towerSelling = new TowerSellingSystem();
    const spellTowerEffects = new SpellTowerEffects();
    const towerUpgrades = new TowerUpgrades();

    this.setupStatisticsAbility();
    this.setupDamageTracking();
    this.setupDamageNumbers();
  }

  private removeRallyAbilityOnTowers() {
    onAnyUnitConstructionFinish(constructed => {
      if (constructed.isUnitType(UNIT_TYPE_STRUCTURE)) {
        constructed.removeAbility(SpellIds.setRally);
      }
    });
    onAnyUnitUpgradeFinish(upgraded => {
      if (upgraded.isUnitType(UNIT_TYPE_STRUCTURE)) {
        upgraded.removeAbility(SpellIds.setRally);
        upgraded.addUnitToStock(UnitIds.upgradeDamage, 1, 1);
        upgraded.addUnitToStock(UnitIds.upgradeSpeed, 1, 1);
        upgraded.addUnitToStock(UnitIds.upgradeModules, 1, 1);

        // const u = new Unit(
        //   upgraded.owner,
        //   upgraded.typeId,
        //   vec2(0, 0),
        //   upgraded.facing
        // );
        // u.removeAbility(SpellIds.setRally);
        // const pos = upgraded.pos;
        // upgraded.destroy();
        // u.pos = pos;
      }
    });
  }

  private setupStatisticsAbility() {
    onAnyUnitSpellEffect((caster, ability) => {
      if (!ability.equals(SpellIds.showTowerStats)) {
        return;
      }
      const info = towerTracker.getTower(caster);
      if (!info) {
        return;
      }
      DisplayTimedTextToPlayer(
        caster.owner.handle,
        0,
        0,
        10,
        `|cffffcc00${caster.name}'s Statistics:|r
|cff6699ffValue:|r ${info.goldValue} gold
|cff6699ffDamage Dealt:|r ${Math.round(info.damageDealt)}
${info.stats.toString()}`
      );
      const range = caster.getWeaponRealField(UNIT_WEAPON_RF_ATTACK_RANGE, 0);
      const indicator = new CircleIndicator(
        caster.pos,
        range + 64,
        Math.round(6 + range / 32)
      );
      doAfter(4, () => indicator.remove());
    });
  }

  private setupDamageTracking() {
    onAnyUnitDamaged((target, attacker, info) => {
      const tower = towerTracker.getTower(attacker);
      if (!tower) {
        return;
      }
      // Remove overkill damage
      let dmg = info.damage;
      if (dmg > target.life) {
        dmg = target.life;
      }
      tower.addDamageDealt(dmg);
    });
  }

  private setupDamageNumbers() {
    eventAnyDamaging
      .filter((_target, attacker, _info) => {
        return playerHumans.reduce(
          (acc, val) => acc || attacker.isSelected(val),
          false as boolean
        );
      })
      .subscribe((target, attacker, info) => {
        const tt = standardTextTag(
          target.pos.polarOffset(degrees(0), Math.random() * 16 - 8),
          `${AttackType.invert(info.attackType).color.code}${Math.round(
            info.damage
          )}|r`
        );
        tt.velocity = degrees(Math.random() * 60 + 60).asDirection.scale(0.05);
        tt.size = 8;
        tt.fadepoint = 1.5;
      });
  }
}
