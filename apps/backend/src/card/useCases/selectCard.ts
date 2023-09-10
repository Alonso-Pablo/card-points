// selectCard.ts
import { Card } from '../domain/Card';
import { CardRepository } from './../infrastructure/CardRepository';

export class SelectCardUseCase {
  private cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository;
  }

  public execute(cardId: string): Card | null {
    // Obtener la carta por su ID utilizando el repositorio
    const card = this.cardRepository.getCardById(cardId);

    // Verificar si la carta existe y si se puede seleccionar
    if (!card || card.isSelected()) {
      return null;
    }

    // Marcar la carta como seleccionada
    card.setSelected();

    // Actualizar la carta utilizando el repositorio
    // this.cardRepository.updateCard(card);

    return card;
  }
}
