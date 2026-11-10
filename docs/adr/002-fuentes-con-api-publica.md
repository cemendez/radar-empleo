# ADR-002: Empezar solo con fuentes que tienen API pública, y respetar sus términos

- **Estado:** aceptada
- **Fecha:** 2026-11-09

## Contexto

Hay muchas fuentes de vacantes y no todas se pueden consultar igual:

| Tipo | Ejemplos | Cómo se consultan |
|---|---|---|
| API o feed público | Get on Board, Remote OK, Remotive, Himalayas, Jobicy, We Work Remotely | Petición HTTP, JSON o RSS, gratis |
| Páginas de empleo de empresas | Muchas usan Greenhouse, Lever o Ashby | Endpoints JSON públicos por empresa |
| Portales sin API o que prohíben el scraping | LinkedIn, Indeed, InfoJobs, Computrabajo, OCC | Scraping (frágil, a veces contra sus términos) o servicios de pago como Apify |
| Marketplaces de perfil | arc.dev, Malt, Talently | No se consultan: creas tu perfil y ellos te buscan |

buscoremotoit.com, que es la referencia de este proyecto, funciona solo con fuentes del primer tipo.

## Decisión

La v0.1 usa solo fuentes con API pública. Los portales sin API quedan para una fase opcional, con tope de gasto si se usa un servicio de pago.

## Reglas que exigen las propias APIs (vienen dentro de sus respuestas)

- **Remote OK:** enlazar de vuelta a la URL original de Remote OK (sin `nofollow`) y mencionarlo como fuente. No usar su logo.
- **Remotive:** enlazar a la URL de Remotive y mencionarlo como fuente. Máximo ~4 consultas al día. Las vacantes llegan con 24 h de retraso. No mostrarlas para recolectar correos o registros.

Por eso `Job.url` siempre es la URL original y `Job.source` siempre se conserva: la página de la v0.3 debe mostrar ambos en cada vacante.

## Consecuencias

- Costo cero y sin riesgo de bloqueos.
- Cobertura limitada al principio: casi todo es remoto internacional y LATAM vía Get on Board. Las vacantes de OCC y Computrabajo (empleo local en México) llegarán después.
- El disparador diario no debe correr más de 4 veces al día.
