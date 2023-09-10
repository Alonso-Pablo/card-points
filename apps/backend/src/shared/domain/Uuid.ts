import { v4 } from 'uuid';

export class Uuid {
  constructor(readonly value: string) {}

  static random(): Uuid {
    return new Uuid(v4());
  }
}
