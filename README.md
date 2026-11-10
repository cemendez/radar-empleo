# Radar Empleo

Buscador personal de vacantes remotas. Junta ofertas de APIs públicas, las convierte a un mismo formato y (en próximas versiones) las filtra, las publica en una página con filtros y manda las mejores por Telegram.

Hermano de [radar-tech](https://github.com/cemendez/radar-tech): misma filosofía (fuentes → curaduría → entrega), proyecto separado ([ADR-001](docs/adr/001-repo-separado.md)).

## Estado

**v0.1 — Recolector** (en curso). Ver [docs/PROGRESO.md](docs/PROGRESO.md) para saber dónde vamos y qué sigue.

| Fuente | Tipo | Estado |
|---|---|---|
| [Get on Board](https://www.getonbrd.com) | API pública JSON | ✓ |
| [Remote OK](https://remoteok.com) | API pública JSON | Ejercicio 1 |
| [Remotive](https://remotive.com) | API pública JSON | Ejercicio 2 |

Todas las vacantes enlazan a su publicación original y mencionan su fuente ([ADR-002](docs/adr/002-fuentes-con-api-publica.md)).

## Uso

Requisitos: Node 22+ y pnpm.

```bash
pnpm install
pnpm test        # pruebas con datos guardados (sin internet)
pnpm dry         # consulta las APIs reales y muestra un resumen, sin escribir archivos
pnpm start       # igual, pero guarda data/jobs.json
pnpm typecheck   # revisa los tipos de TypeScript
```

## Estructura

```
src/
  types.ts          El contrato: interfaz Job y Source
  http.ts           Peticiones HTTP (timeout, User-Agent)
  sources/          Una fuente por archivo: fetchRaw() + normalize()
  dedupe.ts         Quita la misma vacante publicada en varias fuentes
  index.ts          Orquesta: descarga en paralelo → normaliza → deduplica → guarda
test/
  fixtures/         Respuestas reales recortadas de cada API
  *.test.ts         Una suite por fuente
docs/
  adr/              Decisiones de arquitectura
  PROGRESO.md       Bitácora y ejercicios
```

## Licencia

MIT
