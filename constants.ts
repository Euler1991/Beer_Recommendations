import { BeerItem, UserProfile } from './types';

export const COMMERCIAL_BEERS: BeerItem[] = [
  { id: 'cc1', name: 'Corona Extra', type: 'commercial' },
  { id: 'cc2', name: 'Heineken', type: 'commercial' },
  { id: 'cc3', name: 'Budweiser', type: 'commercial' },
  { id: 'cc4', name: 'Modelo Especial', type: 'commercial' },
  { id: 'cc5', name: 'Stella Artois', type: 'commercial' },
  { id: 'cc6', name: 'Guinness Draught', type: 'commercial' },
  { id: 'cc7', name: 'Tecate', type: 'commercial' },
  { id: 'cc8', name: 'Victoria', type: 'commercial' },
  { id: 'cc9', name: 'XX Lager', type: 'commercial' },
  { id: 'cc10', name: 'Indio', type: 'commercial' },
];

export const CRAFT_STYLES: BeerItem[] = [
  // Lagers
  { id: 'ca1', name: 'Pilsner', type: 'craft', category: 'Lager', description: 'Crujiente, limpia y refrescante con un amargor notable.' },
  { id: 'ca2', name: 'Helles', type: 'craft', category: 'Lager', description: 'Suave, maltosa y dorada, menos amarga que una Pilsner.' },
  { id: 'ca3', name: 'Vienna Lager', type: 'craft', category: 'Lager', description: 'Color ámbar, tostada, con notas a caramelo suave.' },
  { id: 'ca4', name: 'Dunkel', type: 'craft', category: 'Lager', description: 'Oscura, notas a pan tostado y chocolate, pero cuerpo ligero.' },
  // Ales
  { id: 'ca5', name: 'Pale Ale', type: 'craft', category: 'Ale', description: 'Equilibrada entre malta y lúpulo, notas frutales o cítricas.' },
  { id: 'ca6', name: 'IPA (India Pale Ale)', type: 'craft', category: 'Ale', description: 'Amarga, aromática, con fuertes notas a lúpulo (resina, frutas).' },
  { id: 'ca7', name: 'Stout', type: 'craft', category: 'Ale', description: 'Negra, cremosa, sabores intensos a café tostado y chocolate.' },
  { id: 'ca8', name: 'Porter', type: 'craft', category: 'Ale', description: 'Oscura, notas a caramelo, chocolate y nuez, cuerpo medio.' },
];

// Seed data: 10 Mock Experts to ensure the algorithm works immediately
export const INITIAL_EXPERTS: UserProfile[] = [
  {
    id: 'exp1', name: 'Juan "Lager" Pérez', type: 'UPT',
    commercialRatings: { cc1: 5, cc2: 4, cc3: 3, cc4: 5, cc5: 4, cc6: 1, cc7: 4, cc8: 5, cc9: 4, cc10: 3 },
    craftRatings: { ca1: 5, ca2: 5, ca3: 4, ca4: 3, ca5: 2, ca6: 1, ca7: 1, ca8: 2 }
  },
  {
    id: 'exp2', name: 'Maria "Hoppy" Gonzalez', type: 'UPT',
    commercialRatings: { cc1: 1, cc2: 2, cc3: 1, cc4: 2, cc5: 3, cc6: 5, cc7: 1, cc8: 3, cc9: 2, cc10: 4 },
    craftRatings: { ca1: 2, ca2: 2, ca3: 3, ca4: 4, ca5: 5, ca6: 5, ca7: 4, ca8: 4 }
  },
  {
    id: 'exp3', name: 'Carlos "Dark" Ruiz', type: 'UPT',
    commercialRatings: { cc1: 1, cc2: 1, cc3: 1, cc4: 2, cc5: 2, cc6: 5, cc7: 1, cc8: 4, cc9: 3, cc10: 5 },
    craftRatings: { ca1: 1, ca2: 2, ca3: 4, ca4: 5, ca5: 3, ca6: 2, ca7: 5, ca8: 5 }
  },
  {
    id: 'exp4', name: 'Ana "Balance" Lopez', type: 'UPT',
    commercialRatings: { cc1: 3, cc2: 3, cc3: 3, cc4: 4, cc5: 4, cc6: 3, cc7: 3, cc8: 4, cc9: 4, cc10: 4 },
    craftRatings: { ca1: 4, ca2: 4, ca3: 5, ca4: 4, ca5: 4, ca6: 3, ca7: 3, ca8: 4 }
  },
  {
    id: 'exp5', name: 'Luis "Cheap" Martinez', type: 'UPT',
    commercialRatings: { cc1: 5, cc2: 5, cc3: 5, cc4: 1, cc5: 1, cc6: 1, cc7: 5, cc8: 1, cc9: 1, cc10: 1 },
    craftRatings: { ca1: 5, ca2: 4, ca3: 2, ca4: 1, ca5: 1, ca6: 1, ca7: 1, ca8: 1 }
  },
  // Add slight variations for robustness
  {
    id: 'exp6', name: 'Sofia "Euro" Diaz', type: 'UPT',
    commercialRatings: { cc1: 2, cc2: 5, cc3: 2, cc4: 3, cc5: 5, cc6: 4, cc7: 2, cc8: 3, cc9: 3, cc10: 3 },
    craftRatings: { ca1: 5, ca2: 5, ca3: 4, ca4: 3, ca5: 3, ca6: 2, ca7: 3, ca8: 3 }
  }
];
