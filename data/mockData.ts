import type { Restaurant, Courier } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Hamburguesas',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSenduZfLkicNFMsPdQsLLSCuONkrwIFm_4-Q&s',
    rating: 4.7,
    reviews: '500+',
    deliveryTime: '25-35 min',
    cuisine: 'Americana',
    price: '$$',
    isOpen: true,
    category: 'Mexicana', // Just for example, categories can be mixed
    menu_items: [
        { id: 101, name: 'Clásica Burger', description: 'Carne, queso, lechuga, tomate.', price: 120, imageUrl: 'https://picsum.photos/seed/b1/200/200'},
        { id: 102, name: 'Doble Queso Burger', description: 'Doble carne, doble queso.', price: 160, imageUrl: 'https://picsum.photos/seed/b2/200/200' },
        { id: 103, name: 'Papas Fritas', description: 'Porción grande de papas.', price: 50, imageUrl: 'https://picsum.photos/seed/b3/200/200' }
    ]
  },
  {
    id: 2,
    name: 'Tacos',
    imageUrl: 'https://storage.googleapis.com/gx-global-cms/mkt/2a3e8217-6ecf-43cd-b5ee-6a3e8f68da12.jpg',
    rating: 4.8,
    reviews: '1k+',
    deliveryTime: '20-30 min',
    cuisine: 'Mexicana',
    price: '$$',
    isOpen: true,
    category: 'Mexicana',
    menu_items: [
        { id: 201, name: 'Tacos al Pastor (3)', description: 'Carne de cerdo marinada.', price: 80, imageUrl: 'https://picsum.photos/seed/t1/200/200' },
        { id: 202, name: 'Gringa de Pastor', description: 'Queso y carne en tortilla de harina.', price: 70, imageUrl: 'https://picsum.photos/seed/t2/200/200' },
        { id: 203, name: 'Guacamole', description: 'Aguacate fresco con totopos.', price: 60, imageUrl: 'https://picsum.photos/seed/t3/200/200' }
    ]
  },
  {
    id: 4,
    name: 'Sushi',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJGgDAitY1DlpqgrMCEp9z5kGoqmcKnF08qw&s',
    rating: 4.9,
    reviews: '800+',
    deliveryTime: '35-45 min',
    cuisine: 'Japonesa',
    price: '$$$',
    isOpen: true,
    category: 'Sushi',
    menu_items: [
        { id: 401, name: 'Rollo California', description: 'Cangrejo, aguacate y pepino.', price: 150, imageUrl: 'https://picsum.photos/seed/s1/200/200' },
        { id: 402, name: 'Nigiri de Salmón (2)', description: 'Salmón fresco sobre arroz.', price: 120, imageUrl: 'https://picsum.photos/seed/s2/200/200' },
        { id: 403, name: 'Edamames', description: 'Vainas de soya al vapor.', price: 70, imageUrl: 'https://picsum.photos/seed/s3/200/200' }
    ]
  },
  {
    id: 5,
    name: 'Ensaladas',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTSK-w1eCJY5gAR0La33zNs4AsGhU0piaT8w&s',
    rating: 4.6,
    reviews: '300+',
    deliveryTime: '15-25 min',
    cuisine: 'Saludable',
    price: '$$',
    isOpen: true,
    category: 'Vegetariano',
    menu_items: [
        { id: 501, name: 'Ensalada César Vegana', description: 'Lechuga, crutones y aderezo césar vegano.', price: 130, imageUrl: 'https://picsum.photos/seed/v1/200/200' },
        { id: 502, name: 'Bowl de Quinoa', description: 'Quinoa con vegetales rostizados.', price: 140, imageUrl: 'https://picsum.photos/seed/v2/200/200' },
    ]
  },
  {
    id: 6,
    name: 'Pizzas',
    imageUrl: 'https://www.hola.com/horizon/landscape/e9e1e82cb873-pepperoni-pizza-abob-t.jpg',
    rating: 4.4,
    reviews: '750+',
    deliveryTime: '25-35 min',
    cuisine: 'Italiana',
    price: '$$',
    isOpen: true,
    category: 'Pizza',
    menu_items: [
        { id: 601, name: 'Pizza Pepperoni', description: 'Clásica pizza de pepperoni.', price: 200, imageUrl: 'https://picsum.photos/seed/p1/200/200' },
        { id: 602, name: 'Pizza Margarita', description: 'Tomate, mozzarella y albahaca.', price: 180, imageUrl: 'https://picsum.photos/seed/p2/200/200' },
    ]
  },
  {
    id: 7,
    name: 'Postres',
    imageUrl: 'https://www.cocinadelirante.com/800x600/filters:format(webp):quality(75)/sites/default/files/images/2023/08/postres-faciles-y-rapidos.jpg',
    rating: 4.8,
    reviews: '400+',
    deliveryTime: '10-20 min',
    cuisine: 'Postres',
    price: '$',
    isOpen: true,
    category: 'Postres',
    menu_items: [
        { id: 701, name: 'Pastel de Chocolate', description: 'Rebanada de pastel cremoso.', price: 90, imageUrl: 'https://picsum.photos/seed/d1/200/200' },
        { id: 702, name: 'Cheesecake de Fresa', description: 'Cheesecake con mermelada de fresa.', price: 95, imageUrl: 'https://picsum.photos/seed/d2/200/200' },
    ]
  },
  {
    id: 8,
    name: 'Baguettes',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkMqa3dWsVUpwGCFGwFsbcLHUbyhhnaifz_A&s',
    rating: 4.9,
    reviews: '600+',
    deliveryTime: '5-15 min',
    cuisine: 'Cafetería',
    price: '$',
    isOpen: true,
    category: 'Café',
    menu_items: [
        { id: 801, name: 'Latte', description: 'Café espresso con leche vaporizada.', price: 60, imageUrl: 'https://picsum.photos/seed/c1/200/200' },
        { id: 802, name: 'Croissant', description: 'Croissant de mantequilla recién horneado.', price: 45, imageUrl: 'https://picsum.photos/seed/c2/200/200' },
    ]
  },
];

export const mockCouriers: Courier[] = [
    // FIX: Added missing 'user_id' property to match the Courier type.
    { id: 1, user_id: 'mock_user_1', name: 'Juan Perez', vehicle: 'Motocicleta', status: 'disponible', rating: 4.8, imageUrl: 'https://i.pravatar.cc/150?img=1' },
    // FIX: Added missing 'user_id' property to match the Courier type.
    { id: 2, user_id: 'mock_user_2', name: 'Maria Garcia', vehicle: 'Bicicleta', status: 'desconectado', rating: 4.9, imageUrl: 'https://i.pravatar.cc/150?img=2' },
    // FIX: Added missing 'user_id' property to match the Courier type.
    { id: 3, user_id: 'mock_user_3', name: 'Carlos Sanchez', vehicle: 'Motocicleta', status: 'disponible', rating: 4.7, imageUrl: 'https://i.pravatar.cc/150?img=3' },
];
