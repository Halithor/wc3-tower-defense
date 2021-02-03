import { Rectangle, Unit } from "w3lib/src/index";

// Creep class keeps track of the state of a creep.
export class Creep {
  private _moveTarget: Rectangle;

  constructor(readonly unit: Unit, moveTarget: Rectangle) {
    this._moveTarget = moveTarget;
    this.orderMove();
  }

  set moveTarget(target: Rectangle) {
    this._moveTarget = target;
    this.orderMove();
  }

  get moveTarget(): Rectangle {
    return this._moveTarget;
  }

  orderMove() {
    this.unit.issueOrderAt('move', this.moveTarget.center);
  }
}

export const creep = (unit: Unit, moveTarget: Rectangle) =>
  new Creep(unit, moveTarget);
