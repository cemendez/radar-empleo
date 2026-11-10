// La misma vacante puede aparecer en varias fuentes (una empresa publica en
// GetOnBrd y en RemoteOK). La identificamos por empresa + título "normalizados":
// sin acentos, sin mayúsculas y sin signos.

import type { Job } from "./types";

export function normalizeText(text: string): string {
    return text
        .normalize("NFD") // separa "é" en "e" + acento...
        .replace(/[̀-ͯ]/g, "") // ...y aquí borra el acento
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export function dedupeKey(job: Job): string {
    return `${normalizeText(job.company)}|${normalizeText(job.title)}`;
}

/** Conserva la primera aparición de cada vacante (el orden de `sources` define la prioridad). */
export function dedupe(jobs: Job[]): { unique: Job[]; duplicates: number } {
    const seen = new Set<string>();
    const unique: Job[] = [];
    for (const job of jobs) {
        const key = dedupeKey(job);
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(job);
    }
    return { unique, duplicates: jobs.length - unique.length };
}
