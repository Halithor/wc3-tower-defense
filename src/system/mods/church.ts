import {AttackType} from 'combattypes';
import {Creep} from 'system/creeps/creep';
import {dealDamageOnHit} from 'system/damage';
import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Item, Subject} from 'w3lib/src/index';
import {ModDamageInfo, Module} from './module';

const priesthoodDamagePerc = 0.15;
const priesthoodAttackType = AttackType.Cursed;

const bishopDamagePerPriestPerc = 0.1;
const bishopAttackType = AttackType.Cursed;

const archbishopDamageBonusPerc = 20;

let priestCount = 0;
const eventPriestCountChange = new Subject<[]>();

let archbishopCount = 0;
const eventArchbishopCountChange = new Subject<[]>();

export namespace Holy {
  export class Priesthood extends Module {
    static readonly itemId = itemId('I00D');
    name = 'Priesthood';
    get description() {
      return `|cff6699ffBonuses:|r|n• On attack, deal |cffffcc00${Math.round(
        100 * priesthoodDamagePerc
      )}%|r of the damage dealt as ${
        priesthoodAttackType.nameColored
      } damage.\n• |cffffcc00+${
        this.stats.damagePerc
      }%|r damage, ${archbishopDamageBonusPerc}% per tower with |cffffcc00Archbishop|r.|n|n|cffaaaaaaMultiple Archbishops on a tower do not stack for bonuses.|r`;
    }
    get stats() {
      return TowerStats.damage(0, archbishopCount * archbishopDamageBonusPerc);
    }

    constructor(item: Item) {
      super(item);
      eventArchbishopCountChange.subscribe(() => {
        if (this.tower) {
          this.tower.mods.change.emit();
          return;
        }
        this.updateTooltip();
      });
    }

    onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      dealDamageOnHit(
        tower.unit,
        target.unit,
        priesthoodDamagePerc * damageInfo.damage,
        true,
        priesthoodAttackType
      );
    }

    onAdd(tower: TowerInfo) {
      const priesthoods = tower.unit.items.filter(i =>
        i.typeId.equals(Priesthood.itemId)
      );
      if (priesthoods.length > 1) {
        return;
      }
      priestCount++;
      eventPriestCountChange.emit();
    }

    onRemove(tower: TowerInfo) {
      const priesthoods = tower.unit.items.filter(i =>
        i.typeId.equals(Priesthood.itemId)
      );
      if (priesthoods.length > 0) {
        return;
      }
      priestCount--;
      eventPriestCountChange.emit();
    }
  }

  export class Bishop extends Module {
    static readonly itemId = itemId('I00E');
    name = 'Bishop';
    get description() {
      return `|cff6699ffBonuses:|r|n• On attack, deal |cffffcc00${Math.round(
        priestCount * bishopDamagePerPriestPerc * 100
      )}%|r of the damage dealt as ${
        bishopAttackType.nameColored
      } damage, ${Math.round(
        bishopDamagePerPriestPerc * 100
      )}% for each tower with |cffffcc00Priesthood|r.\n• |cffffcc00+${
        this.stats.damagePerc
      }%|r damage, ${archbishopDamageBonusPerc}% per tower with |cffffcc00Archbishop|r.|n|n|cffaaaaaaMultiple Priesthoods or Archbishops on a tower do not stack for Bishop bonuses.|r`;
    }
    get stats() {
      return TowerStats.damage(0, archbishopCount * archbishopDamageBonusPerc);
    }

    constructor(item: Item) {
      super(item);

      eventPriestCountChange.subscribe(() => {
        if (this.tower) {
          this.tower.mods.change.emit();
          return;
        }
        this.updateTooltip();
      });
      eventArchbishopCountChange.subscribe(() => {
        if (this.tower) {
          this.tower.mods.change.emit();
          return;
        }
        this.updateTooltip();
      });
    }

    onAttackDamage(target: Creep, tower: TowerInfo, damageInfo: ModDamageInfo) {
      dealDamageOnHit(
        tower.unit,
        target.unit,
        priestCount * bishopDamagePerPriestPerc * damageInfo.damage,
        true,
        priesthoodAttackType
      );
    }
  }

  export class Archbishop extends Module {
    static readonly itemId = itemId('I00F');
    name = 'Archbishop';
    get description() {
      return `|cff6699ffBonuses:|r|n•Increases the bonus damage provided by |cffffcc00Priesthood|r and |cffffcc00Bishop|r modules by ${archbishopDamageBonusPerc}%.`;
    }
    get stats() {
      return TowerStats.empty();
    }

    onAdd(tower: TowerInfo) {
      const count = tower.unit.items.filter(i =>
        i.typeId.equals(Archbishop.itemId)
      );
      if (count.length > 1) {
        return;
      }
      archbishopCount++;
      eventArchbishopCountChange.emit();
    }

    onRemove(tower: TowerInfo) {
      const count = tower.unit.items.filter(i =>
        i.typeId.equals(Archbishop.itemId)
      );
      if (count.length > 0) {
        return;
      }
      archbishopCount--;
      eventArchbishopCountChange.emit();
    }
  }
}
