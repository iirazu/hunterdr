# hunterdr

Juego de caza 2D vertical para navegador, construido con Phaser, TypeScript y Vite.

## Características

- 10 niveles con especies distintas.
- Animales terrestres y aves.
- 6 disparos por nivel.
- Zonas de impacto: corazón, cabeza, cuerpo y extremidades.
- Animales que se mueven, huyen al ser heridos y pueden escapar.
- Mira independiente del dedo: se mueve según el arrastre, no según la posición absoluta.
- Respiración ON/OFF con barra de aire, fatiga y recuperación lenta.
- Viento, distancia, retroceso y oscilación de mira.
- Armería entre niveles.
- Puntuación final y rango.

## Requisitos

- Node.js 18 o superior
- npm

## Desarrollo

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

La salida se genera en `dist/`.

## Despliegue en Netlify

El archivo `netlify.toml` está configurado para compilar con Vite y publicar `dist`.
