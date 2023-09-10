// import { Optional } from './Optional';

export interface Card {
  id: string;
  value: string;
  numberTimesChosen: number;
}

// class Card {
//   private constructor(
//     private id: string,
//     private value: string,
//     private numberTimesChosen: number,
//   ) {}

//   static create(props: {
//     id: string,
//     value: string,
//     numberTimesChosen?: Optional<number>
//   }): Card {
//     return new Card(
//       props.id,
//       props.value,
//       props.numberTimesChosen ?? 0,
//     )
//   }

//   static generateDefault(options?: { defaultValues: string[] }): Card[] {
//     const defaultCardValues = options?.defaultValues ?? ['1/2', '1', '3', '5', '8', '12', '15', '20', '40', '100', '?'];
//     const defaultCards: Card[] = defaultCardValues.map<Card>((defaultCardValue: string, index: number) =>
//       Card.create({
//         id: index.toString(),
//         value: defaultCardValue,
//       })
//     );

//     return defaultCards;
//   }

//   public getId(): string {
//     return this.id;
//   }

//   public getValue(): string {
//     return this.value;
//   }

//   public getNumberTimesChosen(): number {
//     return this.numberTimesChosen;
//   }

//   public setNumberTimesChosen(numberTimesChosen: number): void {
//     this.numberTimesChosen = numberTimesChosen;
//   }
// }
