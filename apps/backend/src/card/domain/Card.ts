import { CardId } from './CardId';

export class Card {
  private constructor(
    private id: string,
    private name: string,
    private value: number,
    private selected: boolean = false,
  ) {}

  static create({
    id,
    name,
    value,
  }: {
    id: CardId;
    name: string;
    value: number;
  }) {
    return new Card(id.value, name, value);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getValue(): number {
    return this.value;
  }

  isSelected(): boolean {
    return this.selected;
  }

  setSelected(): void {
    this.selected = true;
  }
}
