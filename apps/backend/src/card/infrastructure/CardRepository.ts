// card.repository.ts
import { Card } from '../domain/Card';

export class CardRepository {
  private cards: Card[] = [];

  getAllCards(): Card[] {
    return this.cards;
  }

  getCardById(id: string): Card | undefined {
    return this.cards.find((card) => card.getId() === id);
  }

  // updateCard(card: Card): void {
  //   const index = this.cards.findIndex((card) => card.id === card.id);

  //   if (index !== -1) {
  //     this.cards[index] = card;
  //   }
  // }

  // Otros métodos para crear, eliminar, y gestionar las cartas en el repositorio si es necesario
}
