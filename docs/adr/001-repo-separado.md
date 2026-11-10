# ADR-001: Repositorio propio, separado de radar-tech y de career-ops

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

Quiero un sistema que busque vacantes, las filtre y me avise, igual que radar-tech me avisa de noticias. Había tres opciones:

1. Agregarlo dentro de radar-tech.
2. Usar career-ops (agente open source de búsqueda de empleo) y adaptarlo.
3. Un repositorio nuevo.

## Decisión

Repositorio nuevo: `radar-empleo`.

## Razones

- **Responsabilidades distintas.** radar-tech cura noticias; esto busca y califica vacantes. Mezclarlos haría que un cambio en uno pueda romper el otro.
- **Privacidad.** Más adelante el sistema usará mi CV para calificar vacantes. radar-tech es público; el CV nunca debe vivir en un repo público. Aquí la regla es: el perfil personal va en un secret o en un archivo ignorado por git, nunca en el código.
- **Compartible.** Quiero que un amigo pueda usarlo con *su* perfil. Eso obliga a que todo lo personal sea configuración, no código.
- **career-ops no es mío.** Es una herramienta de terceros que se actualiza sola. La uso aparte para evaluar a fondo ofertas puntuales, generar CVs adaptados y preparar entrevistas, y la uso como *referencia de lectura* (licencia MIT) para ver cómo resuelve cada fuente.

## Consecuencias

- Se reutilizan los patrones de radar-tech (ADRs, versiones con tags, Worker de Cloudflare como disparador, Telegram), pero no su código directamente.
- Hay que usar un bot o chat de Telegram distinto para no mezclar noticias y vacantes.
