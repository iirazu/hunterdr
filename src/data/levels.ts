export interface Level {
  name: string;
  speciesIndex: number;
  animalCount: number;
  goal: number;
}

export const LEVELS: Level[] = [
  { name: 'Pradera del alba', speciesIndex: 0, animalCount: 5, goal: 2 },
  { name: 'Bosque de robles', speciesIndex: 1, animalCount: 5, goal: 2 },
  { name: 'Lago entre montañas', speciesIndex: 2, animalCount: 5, goal: 2 },
  { name: 'Colinas de otoño', speciesIndex: 3, animalCount: 5, goal: 3 },
  { name: 'Humedal del jabalí', speciesIndex: 4, animalCount: 5, goal: 3 },
  { name: 'Campo de faisanes', speciesIndex: 5, animalCount: 5, goal: 3 },
  { name: 'Valle de los lobos', speciesIndex: 6, animalCount: 5, goal: 3 },
  { name: 'Bosque del oso', speciesIndex: 7, animalCount: 5, goal: 3 },
  { name: 'Paso de gansos', speciesIndex: 8, animalCount: 5, goal: 3 },
  { name: 'Cielo del águila', speciesIndex: 9, animalCount: 5, goal: 3 }
];
