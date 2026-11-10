// ─────────────────────────────────────────────────────────────────────────
// EJERCICIO 1 — RemoteOK
// Meta: que `pnpm test` pase en test/remoteok.test.ts.
// Guía paso a paso en docs/PROGRESO.md → "Ejercicio 1".
// ─────────────────────────────────────────────────────────────────────────
//
// API: GET https://remoteok.com/api  → un ARREGLO JSON.
// Ojo: el elemento [0] NO es una vacante, es un aviso legal
//   { last_updated, legal: "Please link back ... mention Remote OK as a source" }
//
// Cada vacante trae (entre otros):
//   id, position, company, url, location, tags[], salary_min, salary_max, date
//
// Pistas:
//   - Todas las vacantes de RemoteOK son remotas.
//   - salary_min / salary_max vienen en USD ANUALES, y 0 significa "no publicado".
//   - `date` ya viene en ISO con zona horaria ("2026-11-08T16:00:15+00:00").
//     ¿Qué hace `new Date(date).toISOString()` con eso?
//   - `location` es texto libre y puede venir vacío: ¿qué debería quedar en `locations`?

import { fetchJson } from "../http";
import type { Job, Source } from "../types";

// TODO 1: declara la interfaz con los campos que vas a usar (mira getonbrd.ts, sección 1,
// y test/fixtures/remoteok.json para ver datos reales).
export interface RemoteOkJob {
    id: string;
    // ...
}

/** El arreglo trae el aviso legal en [0] y luego las vacantes. */
export type RemoteOkResponse = unknown[];

export function normalizeRemoteOk(raw: RemoteOkResponse): Job[] {
    // TODO 2: descarta el aviso legal (¿cómo distingues una vacante de lo que no lo es?)
    // TODO 3: convierte cada vacante a Job
    throw new Error("Pendiente: Ejercicio 1 (ver docs/PROGRESO.md)");
}

export const remoteok: Source<RemoteOkResponse> = {
    id: "remoteok",
    // RemoteOK es una sola petición: no hay paginación.
    fetchRaw: () => fetchJson<RemoteOkResponse>("https://remoteok.com/api"),
    normalize: normalizeRemoteOk,
};
