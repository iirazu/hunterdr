export interface Species {
  id: string;
  name: string;
  hitPoints: number;
  size: number;
  speed: number;
  color: number;
  accent: number;
  isBird: boolean;
  value: number;
}

export const SPECIES: Species[] = [
  { id: 'conejo', name: 'Conejo', hitPoints: 1, size: 48, speed: 40, color: 0x998267, accent: 0xe3d6bf, isBird: false, value: 60 },
  { id: 'ciervo', name: 'Ciervo', hitPoints: 3, size: 88, speed: 34, color: 0xa17c4e, accent: 0xe8d3a8, isBird: false, value: 120 },
  { id: 'pato', name: 'Pato', hitPoints: 1, size: 48, speed: 60, color: 0x668369, accent: 0x2f6b4f, isBird: true, value: 70 },
  { id: 'zorro', name: 'Zorro', hitPoints: 2, size: 69, speed: 46, color: 0xbc783e, accent: 0xf4ead8, isBird: false, value: 100 },
  { id: 'jabali', name: 'Jabalí', hitPoints: 4, size: 85, speed: 36, color: 0x5d5547, accent: 0x8c806a, isBird: false, value: 150 },
  { id: 'faisan', name: 'Faisán', hitPoints: 1.5, size: 57, speed: 64, color: 0xa77b46, accent: 0x2d6a6a, isBird: true, value: 110 },
  { id: 'lobo', name: 'Lobo', hitPoints: 3.5, size: 82, speed: 50, color: 0x91948c, accent: 0xd8d8d0, isBird: false, value: 180 },
  { id: 'oso', name: 'Oso', hitPoints: 5.5, size: 106, speed: 30, color: 0x67513c, accent: 0x8a6c4c, isBird: false, value: 300 },
  { id: 'ganso', name: 'Ganso', hitPoints: 2, size: 66, speed: 62, color: 0xb5b4a8, accent: 0x6d6d66, isBird: true, value: 140 },
  { id: 'aguila', name: 'Águila', hitPoints: 2.5, size: 72, speed: 78, color: 0x796149, accent: 0xf2f0e6, isBird: true, value: 250 }
];
