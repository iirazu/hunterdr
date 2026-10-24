# Wildlands · Caza

Juego de caza con mira telescópica para navegador móvil (horizontal). Hecho con Phaser 3, TypeScript y Vite.

## Mecánicas

- 10 niveles, cada uno con una especie distinta: 6 terrestres (conejo, ciervo, zorro, jabalí, lobo, oso) y 4 aves (pato, faisán, ganso, águila).
- 6 disparos por nivel. Hay que abatir el objetivo del nivel para avanzar; si no, se puede reintentar.
- Zonas de impacto: corazón (muerte instantánea), cabeza (x2 de daño), cuerpo (x1) y extremidades (x0.4). Las especies grandes tienen más vida.
- Los animales se mueven, se asustan con los disparos y los heridos huyen.
- La mira tiembla más cuanto más lejos está el objetivo. Mantener RESPIRAR reduce el temblor, pero el aire se agota.
- Viento variable y caída de la bala con la distancia; la bala tarda en llegar, así que hay que adelantar a los animales en movimiento.
- Puntos por especie, zona, distancia, objetivo en movimiento, racha y munición sobrante. Los puntos se convierten en dinero.
- Tienda entre niveles con 6 mejoras (hasta nivel 5): potencia, mira, estabilidad, pulmones, cerrojo y balística.
- Progreso y mejor puntuación guardados en localStorage.

## Controles

- Táctil: toca para entrar en la mira, arrastra para moverla, DISPARAR y RESPIRAR (mantener).
- Teclado: ratón para arrastrar, ESPACIO para disparar, SHIFT para respirar, Z para cambiar de vista.

## Desarrollo

```
npm install
npm run dev
npm run build
```

Los parámetros de equilibrio están en `src/data/levels.ts`, `src/data/species.ts`, `src/data/upgrades.ts` y `src/entities/Bullet.ts`.
