import type { Species } from '../entities/Animal';

export const SPECIES: Species[] = [
  { name: 'Conejo', hp: 1, speed: 25, color: 0x998267, isBird: false },
  { name: 'Ciervo', hp: 3, speed: 22, color: 0xa17c4e, isBird: false },
  { name: 'Pato', hp: 1, speed: 42, color: 0x668369, isBird: true },
  { name: 'Zorro', hp: 2, speed: 30, color: 0xbc783e, isBird: false },
  { name: 'Jabalí', hp: 4, speed: 23, color: 0x5d5547, isBird: false },
  { name: 'Faisán', hp: 1.5, speed: 46, color: 0xa77b46, isBird: true },
  { name: 'Lobo', hp: 3.5, speed: 31, color: 0x91948c, isBird: false },
  { name: 'Oso', hp: 5.5, speed: 20, color: 0x67513c, isBird: false },
  { name: 'Ganso', hp: 2, speed: 46, color: 0xb5b4a8, isBird: true },
  { name: 'Águila', hp: 2.5, speed: 54, color: 0x796149, isBird: true }
];
