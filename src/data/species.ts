export interface Species {
  name: string;
  hitPoints: number;
  size: number;
  speed: number;
  color: number;
  isBird: boolean;
}

export const SPECIES: Species[] = [
  { name: 'Conejo', hitPoints: 1, size: 48, speed: 25, color: 0x998267, isBird: false },
  { name: 'Ciervo', hitPoints: 3, size: 88, speed: 22, color: 0xa17c4e, isBird: false },
  { name: 'Pato', hitPoints: 1, size: 48, speed: 42, color: 0x668369, isBird: true },
  { name: 'Zorro', hitPoints: 2, size: 69, speed: 30, color: 0xbc783e, isBird: false },
  { name: 'Jabalí', hitPoints: 4, size: 85, speed: 23, color: 0x5d5547, isBird: false },
  { name: 'Faisán', hitPoints: 1.5, size: 57, speed: 46, color: 0xa77b46, isBird: true },
  { name: 'Lobo', hitPoints: 3.5, size: 82, speed: 31, color: 0x91948c, isBird: false },
  { name: 'Oso', hitPoints: 5.5, size: 106, speed: 20, color: 0x67513c, isBird: false },
  { name: 'Ganso', hitPoints: 2, size: 66, speed: 46, color: 0xb5b4a8, isBird: true },
  { name: 'Águila', hitPoints: 2.5, size: 72, speed: 54, color: 0x796149, isBird: true }
];
