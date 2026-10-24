export interface Palette {
  skyTop: number;
  skyBottom: number;
  hills: number;
  ground: number;
  groundDark: number;
  trees: number;
}

export interface LevelData {
  name: string;
  speciesIndex: number;
  goal: number;
  animalCount: number;
  wind: number;
  minDist: number;
  maxDist: number;
  speedMul: number;
  time: number;
  palette: Palette;
}

const dawn: Palette = { skyTop: 0x6fa8dc, skyBottom: 0xf6d6a8, hills: 0x6f9a6a, ground: 0x7fae5a, groundDark: 0x5f8f45, trees: 0x2f5d38 };
const forest: Palette = { skyTop: 0x5b8fb9, skyBottom: 0xcfe3d2, hills: 0x4c7a55, ground: 0x5f8a45, groundDark: 0x46703a, trees: 0x24472b };
const lake: Palette = { skyTop: 0x4a7fb5, skyBottom: 0xbfdcec, hills: 0x6a7f9a, ground: 0x6a9a74, groundDark: 0x4e7c5e, trees: 0x2c4d44 };
const autumn: Palette = { skyTop: 0x7d9cc0, skyBottom: 0xf0cf9a, hills: 0xa0703f, ground: 0xb08a45, groundDark: 0x8d6b34, trees: 0xa8472a };
const marsh: Palette = { skyTop: 0x71859a, skyBottom: 0xc7cfc0, hills: 0x56705a, ground: 0x6b7a47, groundDark: 0x4f5c36, trees: 0x33452f };
const field: Palette = { skyTop: 0x5e9bd0, skyBottom: 0xf3e2b5, hills: 0x9aa65a, ground: 0xc2b25a, groundDark: 0x9c8f43, trees: 0x4b6b2f };
const valley: Palette = { skyTop: 0x3f5f86, skyBottom: 0xa7b6c8, hills: 0x56637a, ground: 0x5d7355, groundDark: 0x445a40, trees: 0x1f3a2c };
const bear: Palette = { skyTop: 0x4a6a80, skyBottom: 0xb7c7c0, hills: 0x3e5a4c, ground: 0x4f6b3c, groundDark: 0x3b5430, trees: 0x1b3524 };
const pass: Palette = { skyTop: 0x5a7fa8, skyBottom: 0xe9d8c0, hills: 0x7a7f8a, ground: 0x8a9a6a, groundDark: 0x6c7b50, trees: 0x3b5a40 };
const eagle: Palette = { skyTop: 0x2f6fb8, skyBottom: 0xbfe0f4, hills: 0x7d8da5, ground: 0x8c8a6a, groundDark: 0x6e6c52, trees: 0x45603f };

export const LEVELS: LevelData[] = [
  { name: 'Pradera del alba', speciesIndex: 0, goal: 2, animalCount: 4, wind: 0.5, minDist: 60, maxDist: 120, speedMul: 1, time: 90, palette: dawn },
  { name: 'Bosque de robles', speciesIndex: 1, goal: 2, animalCount: 4, wind: 1, minDist: 80, maxDist: 150, speedMul: 1, time: 90, palette: forest },
  { name: 'Lago entre montañas', speciesIndex: 2, goal: 2, animalCount: 5, wind: 1.5, minDist: 90, maxDist: 160, speedMul: 1, time: 90, palette: lake },
  { name: 'Colinas de otoño', speciesIndex: 3, goal: 2, animalCount: 5, wind: 2, minDist: 90, maxDist: 180, speedMul: 1.05, time: 85, palette: autumn },
  { name: 'Humedal del jabalí', speciesIndex: 4, goal: 2, animalCount: 4, wind: 2.5, minDist: 100, maxDist: 190, speedMul: 1.1, time: 85, palette: marsh },
  { name: 'Campo de faisanes', speciesIndex: 5, goal: 2, animalCount: 6, wind: 3, minDist: 100, maxDist: 200, speedMul: 1.1, time: 80, palette: field },
  { name: 'Valle de los lobos', speciesIndex: 6, goal: 2, animalCount: 5, wind: 3.5, minDist: 120, maxDist: 220, speedMul: 1.2, time: 80, palette: valley },
  { name: 'Bosque del oso', speciesIndex: 7, goal: 1, animalCount: 3, wind: 4, minDist: 120, maxDist: 230, speedMul: 1.2, time: 80, palette: bear },
  { name: 'Paso de gansos', speciesIndex: 8, goal: 2, animalCount: 6, wind: 4.5, minDist: 130, maxDist: 240, speedMul: 1.25, time: 75, palette: pass },
  { name: 'Cielo del águila', speciesIndex: 9, goal: 2, animalCount: 7, wind: 5, minDist: 140, maxDist: 260, speedMul: 1.3, time: 75, palette: eagle }
];
