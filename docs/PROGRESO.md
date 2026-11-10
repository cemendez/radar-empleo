# Bitácora y ruta de aprendizaje

## Dónde vamos

**Última sesión: 2026-11-09.** Quedó lista la estructura de la v0.1 con Get on Board funcionando como ejemplo resuelto, probado contra la API real (521 vacantes únicas en una corrida de prueba con las tres fuentes). Siguen los ejercicios 1 y 2.

## Retomar en otra máquina

```bash
git clone https://github.com/cemendez/radar-empleo.git
cd radar-empleo
pnpm install
pnpm test       # Get on Board pasa; RemoteOK y Remotive fallan hasta hacer los ejercicios
pnpm dry        # Get on Board trae vacantes reales; las otras dos marcan "Pendiente"
```

Si `pnpm dry` marca `fetch failed` en todas las fuentes, es la red (proxy o firewall), no el código.

### Seguridad de dependencias (lección del 2026-11-10)

El primer `pnpm install` falló con `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`: el lockfile traía `vite@7.3.8`, publicada horas antes, y tu pnpm tiene activado `minimumReleaseAge`.

- **Qué protege:** en los ataques a la cadena de suministro alguien publica una versión maliciosa de un paquete popular. Casi siempre se detecta y se retira en horas o pocos días. Si esperas antes de instalar versiones nuevas, ese riesgo desaparece.
- **Cómo quedó:** `pnpm-workspace.yaml` fija `minimumReleaseAge: 4320` (3 días) para todo el que clone el repo, incluyendo tu amigo y GitHub Actions. El lockfile se regeneró con versiones que cumplen la regla.
- **Segunda protección, `ERR_PNPM_IGNORED_BUILDS`:** pnpm 10 no ejecuta los scripts `postinstall` de las dependencias, porque un script de instalación malicioso es otra vía de ataque común. Tu configuración usa el modo estricto (`strictDepBuilds`), que convierte el aviso en error. Solución: autorizar explícitamente solo a `esbuild` (lo usan tsx y vitest para preparar su binario) con `allowBuilds` en `pnpm-workspace.yaml`. Equivale a correr `pnpm approve-builds`, pero queda versionado para todos. Ojo: pnpm 10 usaba `onlyBuiltDependencies`; desde pnpm 11 la opción es `allowBuilds` (probado en 10, 11 y 12). Cuando una guía de internet no te funcione, revisa primero qué versión de la herramienta usa la guía y cuál usas tú (`pnpm -v`).
- **Si vuelve a pasar:** no desactives la protección. Borra `pnpm-lock.yaml`, corre `pnpm install` (pnpm elige la versión más nueva que ya cumpla la edad mínima) y haz commit del lockfile nuevo.

---

## Método

Cada paso tiene tres partes:

1. **Objetivo:** qué vas a entender.
2. **Práctica:** lo haces tú. Las pruebas en `test/` son la especificación: si pasan, terminaste.
3. **Comprobación:** explica con tus palabras lo que hiciste (a Claude, a tu amigo o en un post). Si no lo puedes explicar, todavía no lo entendiste.

---

## Paso 0: Leer el ejemplo resuelto (unos 30 minutos)

**Objetivo:** entender el patrón que se repite en todas las fuentes.

Lee en este orden:

1. `src/types.ts`: el contrato. ¿Por qué `normalize` está separado de `fetchRaw`?
2. `src/sources/getonbrd.ts`: las 4 secciones (tipos crudos → tablas de traducción → normalizar → descargar).
3. `test/getonbrd.test.ts`: cada prueba es una decisión de diseño.
4. `src/index.ts`: ¿por qué `Promise.allSettled` y no `Promise.all`?

**Comprobación:** responde sin ver el código:

- ¿Qué pasaría si mañana Get on Board agrega una modalidad nueva, por ejemplo `"4x3"`?
- ¿Por qué `published_at` se multiplica por 1000?
- ¿Por qué el salario de Get on Board lleva `period: "month"`?

## Ejercicio 1: Remote OK (unos 45 minutos)

**Objetivo:** aplicar el patrón tú solo y aprender a *filtrar con un type guard*.

1. Abre `test/fixtures/remoteok.json` y mira los datos reales. Fíjate en el elemento `[0]`.
2. Corre las pruebas en modo vigilancia: `pnpm test:watch remoteok`. Se vuelven a correr cada vez que guardas.
3. Completa `src/sources/remoteok.ts`: TODO 1 (interfaz), TODO 2 (descartar el aviso legal), TODO 3 (convertir).
4. Termina cuando las 7 pruebas estén en verde.

**Concepto nuevo, el type guard:** `raw` es `unknown[]` porque el arreglo mezcla un aviso legal con vacantes. Una función como esta:

```ts
const isJob = (x: unknown): x is RemoteOkJob => ...
```

le dice a TypeScript "si esto regresa `true`, trátalo como `RemoteOkJob`". Así, `raw.filter(isJob)` te devuelve `RemoteOkJob[]` ya tipado.

**Comprobación:** ¿cómo decidiste qué es una vacante y qué no? ¿Qué pasa con `salary_min: 0`?

## Ejercicio 2: Remotive (unos 30 minutos)

**Objetivo:** detectar una trampa real de zonas horarias.

1. Mira `test/fixtures/remotive.json` y el comentario de arriba en `src/sources/remotive.ts`.
2. Antes de programar, corre esto en la consola (`node`) y compara los resultados:

   ```js
   new Date("2026-11-06T08:51:01").toISOString()
   new Date("2026-11-06T08:51:01Z").toISOString()
   ```

3. Completa `normalizeRemotive` hasta que pasen las 4 pruebas.

**Comprobación:** ¿por qué la prueba de la trampa podría pasar en un servidor de GitHub Actions y fallar en tu laptop? (Pista: ¿en qué zona horaria corre cada uno?)

## Cierre de la v0.1

- [ ] `pnpm test` en verde (18 pruebas)
- [ ] `pnpm typecheck` sin errores
- [ ] `pnpm dry` trae las tres fuentes
- [ ] Commit, tag `v0.1.0` y release en GitHub
- [ ] Post en LinkedIn (idea: "Tres APIs, tres formatos de fecha distintos")

---

## Ruta completa

| Versión | Qué | Qué aprendes |
|---|---|---|
| **v0.1** | Recolector: 3 fuentes normalizadas | Consumir APIs, diseñar tipos, pruebas con fixtures |
| v0.2 | Clasificación por reglas: rol, nivel, zona (¿puedo trabajar desde México?), parseo de `salaryText` | Expresiones regulares, reglas sin IA |
| v0.3 | Página con filtros, desplegada aparte (no en el portafolio) | Astro + isla de React, filtros en el cliente |
| v0.4 | LLM: puntaje contra tu perfil + red flags. Top 5 diario por Telegram (bot aparte) | Prompts como datos, perfil en secrets, GitHub Actions + Worker |
| v0.5 | Empresas de tu lista vía su ATS (Greenhouse, Lever, Ashby) | Descubrir APIs, más fuentes con el mismo patrón |
| Opcional | Portales sin API (LinkedIn, Computrabajo) vía Apify con tope de gasto | Costos por uso, decidir cuándo vale pagar |
| Extra Python | Con semanas de `data/` acumuladas: salarios por stack y país con pandas | Tu primer análisis de datos real |

Fuentes candidatas para sumar con el mismo patrón: Himalayas, Jobicy, We Work Remotely (RSS), Working Nomads, Manfred (España). career-ops (`providers/*.mjs`) tiene ejemplos de cada una para consultar.
