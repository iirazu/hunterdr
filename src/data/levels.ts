export interface LevelData {
  name: string;
  speciesIndex: number;
  goal: number;
  animalCount: number;
  index: number;
}

export const LEVELS: LevelData[] = [
  { name: 'Pradera del alba', speciesIndex: 0, goal: 2, animalCount: 4, index: 0 },
  { name: 'Bosque de robles', speciesIndex: 1, goal: 2, animalCount: 4, index: 1 },
  { name: 'Lago entre montañas', speciesIndex: 2, goal: 2, animalCount: 5, index: 2 },
  { name: 'Colinas de otoño', speciesIndex: 3, goal: 3, animalCount: 4, index: 3 },
  { name: 'Humedal del jabalí', speciesIndex: 4, goal: 2, animalCount: 4, index: 4 },
  { name: 'Campo de faisanes', speciesIndex: 5, goal: 3, animalCount: 5, index: 5 },
  { name: 'Valle de los lobos', speciesIndex: 6, goal: 3, animalCount: 5, index: 6 },
  { name: 'Bosque del oso', speciesIndex: 7, goal: 2, animalCount: 4, index: 7 },
  { name: 'Paso de gansos', speciesIndex: 8, goal: 3, animalCount: 6, index: 8 },
  { name: 'Cielo del águila', speciesIndex: 9, goal: 3, animalCount: 6, index: 9 }
];
