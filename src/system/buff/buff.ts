import {Unit} from 'w3lib/src/index';

export interface Buff {
  addToUnit(u: Unit): void;
  removeFromUnit(u: Unit): void;
  tick(u: Unit): void;
}

interface ConflictResolver {
  resolve(it: Buff, other: Buff): [replace: boolean, buff: Buff];
}


class BuffImpl implements Buff {
  constructor(private readonly conflictResolver: ConflictResolver) {}

  resolveSameBuff(other: Buff) {
    return this.conflictResolver.resolve(this, other)
  }

  addToUnit(u: Unit): void {
    throw new Error('Method not implemented.');
  }
  removeFromUnit(u: Unit): void {
    throw new Error('Method not implemented.');
  }
  tick(u: Unit): void {
    throw new Error('Method not implemented.');
  }
}
