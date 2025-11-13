import type { Restaurant } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'The Burger Joint',
    imageUrl: 'https://picsum.photos/seed/burger/400/200',
    rating: 4.7,
    reviews: '500+',
    deliveryTime: '25-35 min',
    cuisine: 'Americana',
    price: '$$',
    isOpen: true,
    category: 'Mexicana', // Just for example, categories can be mixed
    menuItems: [
        { id: 101, name: 'Clásica Burger', description: 'Carne, queso, lechuga, tomate.', price: 120, imageUrl: 'https://picsum.photos/seed/b1/200/200'},
        { id: 102, name: 'Doble Queso Burger', description: 'Doble carne, doble queso.', price: 160, imageUrl: 'https://picsum.photos/seed/b2/200/200' },
        { id: 103, name: 'Papas Fritas', description: 'Porción grande de papas.', price: 50, imageUrl: 'https://picsum.photos/seed/b3/200/200' }
    ]
  },
  {
    id: 2,
    name: 'The Taco Spot',
    imageUrl: 'https://picsum.photos/seed/taco/400/200',
    rating: 4.8,
    reviews: '1k+',
    deliveryTime: '20-30 min',
    cuisine: 'Mexicana',
    price: '$$',
    isOpen: true,
    category: 'Mexicana',
    menuItems: [
        { id: 201, name: 'Tacos al Pastor (3)', description: 'Carne de cerdo marinada.', price: 80, imageUrl: 'https://picsum.photos/seed/t1/200/200' },
        { id: 202, name: 'Gringa de Pastor', description: 'Queso y carne en tortilla de harina.', price: 70, imageUrl: 'https://picsum.photos/seed/t2/200/200' },
        { id: 203, name: 'Guacamole', description: 'Aguacate fresco con totopos.', price: 60, imageUrl: 'https://picsum.photos/seed/t3/200/200' }
    ]
  },
  {
    id: 4,
    name: 'Sushi Heaven',
    imageUrl: 'https://picsum.photos/seed/sushi/400/200',
    rating: 4.9,
    reviews: '800+',
    deliveryTime: '35-45 min',
    cuisine: 'Japonesa',
    price: '$$$',
    isOpen: true,
    category: 'Sushi',
    menuItems: [
        { id: 401, name: 'Rollo California', description: 'Cangrejo, aguacate y pepino.', price: 150, imageUrl: 'https://picsum.photos/seed/s1/200/200' },
        { id: 402, name: 'Nigiri de Salmón (2)', description: 'Salmón fresco sobre arroz.', price: 120, imageUrl: 'https://picsum.photos/seed/s2/200/200' },
        { id: 403, name: 'Edamames', description: 'Vainas de soya al vapor.', price: 70, imageUrl: 'https://picsum.photos/seed/s3/200/200' }
    ]
  },
  {
    id: 5,
    name: 'Green Delight',
    imageUrl: 'https://picsum.photos/seed/salad/400/200',
    rating: 4.6,
    reviews: '300+',
    deliveryTime: '15-25 min',
    cuisine: 'Saludable',
    price: '$$',
    isOpen: true,
    category: 'Vegetariano',
    menuItems: [
        { id: 501, name: 'Ensalada César Vegana', description: 'Lechuga, crutones y aderezo césar vegano.', price: 130, imageUrl: 'https://picsum.photos/seed/v1/200/200' },
        { id: 502, name: 'Bowl de Quinoa', description: 'Quinoa con vegetales rostizados.', price: 140, imageUrl: 'https://picsum.photos/seed/v2/200/200' },
    ]
  },
  {
    id: 6,
    name: 'Pizza Palace',
    imageUrl: 'https://picsum.photos/seed/pizza/400/200',
    rating: 4.4,
    reviews: '750+',
    deliveryTime: '25-35 min',
    cuisine: 'Italiana',
    price: '$$',
    isOpen: true,
    category: 'Pizza',
    menuItems: [
        { id: 601, name: 'Pizza Pepperoni', description: 'Clásica pizza de pepperoni.', price: 200, imageUrl: 'https://picsum.photos/seed/p1/200/200' },
        { id: 602, name: 'Pizza Margarita', description: 'Tomate, mozzarella y albahaca.', price: 180, imageUrl: 'https://picsum.photos/seed/p2/200/200' },
    ]
  },
  {
    id: 7,
    name: 'Sweet Dreams',
    imageUrl: 'https://picsum.photos/seed/dessert/400/200',
    rating: 4.8,
    reviews: '400+',
    deliveryTime: '10-20 min',
    cuisine: 'Postres',
    price: '$',
    isOpen: true,
    category: 'Postres',
    menuItems: [
        { id: 701, name: 'Pastel de Chocolate', description: 'Rebanada de pastel cremoso.', price: 90, imageUrl: 'https://picsum.photos/seed/d1/200/200' },
        { id: 702, name: 'Cheesecake de Fresa', description: 'Cheesecake con mermelada de fresa.', price: 95, imageUrl: 'https://picsum.photos/seed/d2/200/200' },
    ]
  },
  {
    id: 8,
    name: 'The Daily Grind',
    imageUrl: 'https://picsum.photos/seed/coffee/400/200',
    rating: 4.9,
    reviews: '600+',
    deliveryTime: '5-15 min',
    cuisine: 'Cafetería',
    price: '$',
    isOpen: true,
    category: 'Café',
    menuItems: [
        { id: 801, name: 'Latte', description: 'Café espresso con leche vaporizada.', price: 60, imageUrl: 'https://picsum.photos/seed/c1/200/200' },
        { id: 802, name: 'Croissant', description: 'Croissant de mantequilla recién horneado.', price: 45, imageUrl: 'https://picsum.photos/seed/c2/200/200' },
    ]
  },
];
