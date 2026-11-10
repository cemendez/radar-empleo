// ─────────────────────────────────────────────────────────────────────────
// EJERCICIO 2 — Remotive
// Meta: que `pnpm test` pase en test/remotive.test.ts.
// Guía en docs/PROGRESO.md → "Ejercicio 2".
// ─────────────────────────────────────────────────────────────────────────
//
// API: GET https://remotive.com/api/remote-jobs?category=software-dev
//   → { "job-count": n, jobs: [ ... ] }
//
// Reglas de Remotive (vienen en su propia respuesta, campo "0-legal-notice"):
//   - Máximo ~4 consultas al día. Más que eso te bloquean.
//   - Las vacantes llegan con 24 h de retraso.
//   - Hay que enlazar a la URL de Remotive y mencionarlo como fuente.
//
// Campos útiles: id, url, title, company_name, tags[], job_type,
//   publication_date, candidate_required_location, salary
//
// Pistas:
//   - Todas son remotas, pero `candidate_required_location` dice DESDE DÓNDE
//     puedes trabajar ("USA", "Worldwide", "Americas, Europe"). Vale oro para ti.
//   - `salary` es TEXTO libre ("$25k - $35k" o ""). En la v0.1 no lo parseamos:
//     ¿en qué campo de Job va?
//   - TRAMPA: `publication_date` viene SIN zona horaria ("2026-11-06T08:51:01").
//     Remotive la publica en UTC, pero `new Date()` la interpretaría en la hora
//     LOCAL de tu computadora. Prueba en la consola de Node:
//       new Date("2026-11-06T08:51:01").toISOString()
//       new Date("2026-11-06T08:51:01Z").toISOString()

import { fetchJson } from "../http";
import type { Job, Source } from "../types";

export interface RemotiveJob {
    id: number;
    // TODO 1: completa los campos que uses
}

export interface RemotiveResponse {
    jobs: RemotiveJob[];
}

export function normalizeRemotive(raw: RemotiveResponse): Job[] {
    // TODO 2: convierte cada vacante a Job
    throw new Error("Pendiente: Ejercicio 2 (ver docs/PROGRESO.md)");
}

export const remotive: Source<RemotiveResponse> = {
    id: "remotive",
    fetchRaw: () => fetchJson<RemotiveResponse>("https://remotive.com/api/remote-jobs?category=software-dev"),
    normalize: normalizeRemotive,
};
