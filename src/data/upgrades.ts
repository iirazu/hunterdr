import { Upgrades } from '../state';

export const scopeZoom = (lv: number): number => 2.4 + 0.4 * lv;
export const airTime = (lv: number): number => 3.5 * (1 + 0.25 * lv);
export const cooldown = (lv: number): number => Math.max(0.45, 1.3 - 0.16 * lv);

export interface UpgradeDef {
  id: keyof Upgrades;
  name: string;
  baseCost: number;
  effect: (lv: number) => string;
}

export const UPGRADE_DEFS: UpgradeDef[] = [
  { id: 'power', name: 'Potencia', baseCost: 180, effect: lv => `Daño +${lv * 20}% · bala más rápida y menos caída` },
  { id: 'scope', name: 'Mira', baseCost: 150, effect: lv => `Zoom x${scopeZoom(lv).toFixed(1)}` },
  { id: 'stability', name: 'Estabilidad', baseCost: 160, effect: lv => `Temblor -${lv * 12}%` },
  { id: 'lungs', name: 'Pulmones', baseCost: 120, effect: lv => `Apnea de ${airTime(lv).toFixed(1)} s` },
  { id: 'bolt', name: 'Cerrojo', baseCost: 130, effect: lv => `Recarga de ${cooldown(lv).toFixed(2)} s` },
  { id: 'wind', name: 'Balística', baseCost: 170, effect: lv => `Deriva del viento -${lv * 15}%` }
];

export const upgradeCost = (def: UpgradeDef, lv: number): number => Math.round(def.baseCost * (1 + lv * 0.75));
