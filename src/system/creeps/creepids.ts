import {unitId} from 'w3lib/src/index';

export class CreepIds {
  static readonly kobold = unitId('n000');
  static readonly gnoll = unitId('n001');
  static readonly wolf = unitId('n002');
  static readonly wendigo = unitId('n003');
  static readonly turtle = unitId('n004');
  static readonly succubus = unitId('n005');
  static readonly satyr = unitId('n006');
  static readonly prawn = unitId('n007');

  static readonly list = [
    CreepIds.kobold,
    CreepIds.gnoll,
    CreepIds.wolf,
    CreepIds.wendigo,
    CreepIds.turtle,
    CreepIds.succubus,
    CreepIds.satyr,
    CreepIds.prawn,
  ];
}
