# hunterdr

Juego de caza 2D vertical para navegador, construido con Phaser, TypeScript y Vite.

## Mejoras de armería

- Potencia: aumenta el daño.
- Mira: aumenta los aumentos disponibles.
- Estabilidad: reduce la oscilación.
- Respiración: aumenta la reserva de aire.
- Cerrojo: reduce el tiempo de recarga.
- Munición perforante: mejora el daño en impactos al cuerpo.
- Viento compensado: reduce el efecto del viento.
- Telemetría: muestra mejor la distancia y el punto de impacto.
- Racha: aumenta el bonus por impactos consecutivos.
- Botiquín: recupera aire más rápido tras la fatiga.

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
