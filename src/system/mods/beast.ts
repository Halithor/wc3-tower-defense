import {TowerInfo} from 'system/towers/towerinfo';
import {TowerStats} from 'system/towers/towerstats';
import {itemId} from 'w3lib/src/common';
import {Item, Subject} from 'w3lib/src/index';
import {Module} from './module';

const packHunterBonusDamage = 1;

let packHunterTowers = 0;
const packHunterChangeSubject = new Subject<[]>();

export namespace Beast {
  export class PackHunter extends Module {
    static readonly itemId = itemId('I005');
    name = 'Pack Hunter';
    description = `Gain +${packHunterBonusDamage} damage for every other tower with this mod.`;
    stats = TowerStats.empty();

    tower?: TowerInfo;

    constructor(item: Item) {
      super(item);

      packHunterChangeSubject.subscribe(() => {
        this.onChange();
      });
    }

    onChange() {
      if (!this.tower) {
        return;
      }
      this.stats = TowerStats.damage(
        Math.round(packHunterTowers * packHunterBonusDamage),
        0
      );
      this.tower.mods.change.emit();
      this.item.tooltipExtended =
        this.description +
        `|n|n|cffaaaaaaCurrently totals +${Math.round(
          packHunterTowers * packHunterBonusDamage
        )} damage.`;
    }

    onAdd(tower: TowerInfo) {
      print('add pack hunter');
      packHunterTowers += 1;
      this.tower = tower;

      packHunterChangeSubject.emit();
    }

    onRemove(tower: TowerInfo) {
      print('remove pack hunter');
      this.tower = undefined;
      packHunterTowers -= 1;

      packHunterChangeSubject.emit();
    }
  }
}
