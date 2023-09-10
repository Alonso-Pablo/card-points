import express, { Request, Response } from 'express';
// import { Card } from '../domain/Card';

const router = express.Router();

// Obtener todas las cartas
router.get('/', (req: Request, res: Response) => {
  // const cards = CardService.getAllCards();
  // res.json(cards);/
  res.json('cards');
});

// Obtener una carta por su ID
router.get('/:id', (req: Request, res: Response) => {
  // const cardId = parseInt(req.params.id, 10);
  // const card = CardService.getCardById(cardId);

  // if (!card) {
  //   return res.status(404).json({ message: 'Carta no encontrada' });
  // }

  // res.json(card);
  res.json('card');
});

// Seleccionar una carta
router.post('/select', (req: Request, res: Response) => {
  const { cardId } = req.body;

  if (!cardId) {
    return res.status(400).json({ message: 'Se debe proporcionar un ID de carta válido' });
  }

  // const selectedCard = CardService.selectCard(cardId);

  // if (!selectedCard) {
  //   return res.status(404).json({ message: 'Carta no encontrada' });
  // }

  // res.json({ message: 'Carta seleccionada exitosamente', card: selectedCard });
  res.json({ message: 'Carta seleccionada exitosamente', card: cardId });
});

export { router as CardsController };
