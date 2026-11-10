// ─────────────────────────────────────────────────────────────────────────
// EJEMPLO RESUELTO. Léelo completo antes de hacer remoteok.ts y remotive.ts:
// esas dos fuentes siguen exactamente el mismo patrón.
// ─────────────────────────────────────────────────────────────────────────
//
// Get on Board — API pública, sin login.
// Docs: https://api-doc.getonbrd.com
//
// Su API sigue la convención JSON:API: cada vacante es
//   { id, type, attributes: {...}, links: {...} }
// y las relaciones (empresa, tags, seniority) vienen como referencias
// { data: { id, type } } a menos que pidas `expand[]=...` para que las incluya.

import { fetchJson } from "../http";
import type { Job, Salary, Seniority, Source, WorkMode } from "../types";

// ── 1. Tipos de la respuesta CRUDA ────────────────────────────────────────
// Solo declaramos los campos que usamos. Esto documenta "qué esperamos de la
// API" y TypeScript nos avisa si intentamos leer algo que no declaramos.

interface GobRef<A> {
    data: { id: string; type: string; attributes: A };
}

interface GobJob {
    id: string;
    attributes: {
        title: string;
        remote: boolean;
        remote_modality: "fully_remote" | "remote_local" | "temporarily_remote" | "hybrid" | "no_remote" | string;
        countries: string[];
        min_salary: number | null;
        max_salary: number | null;
        published_at: number; // epoch en SEGUNDOS
        seniority: GobRef<{ locale_key: string }>;
        tags: { data: { id: string; attributes: { name: string } }[] };
        company: GobRef<{ name: string }>;
    };
    links: { public_url: string };
}

export interface GobResponse {
    data: GobJob[];
    meta: { page: number; per_page: number; total_pages: number };
}

// ── 2. Tablas de traducción ───────────────────────────────────────────────
// Un Record<origen, destino> es más claro y fácil de extender que un if/else.

const SENIORITY: Record<string, Seniority> = {
    no_experience: "trainee",
    junior: "junior",
    semi_senior: "semi-senior",
    senior: "senior",
    expert: "expert",
};

function toWorkMode(modality: string): WorkMode {
    if (modality === "fully_remote" || modality === "remote_local" || modality === "temporarily_remote") {
        return "remote";
    }
    if (modality === "hybrid") return "hybrid";
    if (modality === "no_remote") return "onsite";
    return "unknown"; // un valor nuevo de la API no rompe nada: queda como desconocido
}

// ── 3. Normalizar: crudo → Job ────────────────────────────────────────────
// Función PURA: no hace red, no lee archivos. Por eso se prueba con fixtures.

export function normalizeGetonbrd(raw: GobResponse): Job[] {
    return raw.data.map((j): Job => {
        const a = j.attributes;

        // GetOnBrd publica salarios en USD MENSUALES. Solo creamos `salary`
        // si al menos uno de los extremos existe (no inventamos datos).
        let salary: Salary | undefined;
        if (a.min_salary || a.max_salary) {
            salary = {
                min: a.min_salary ?? undefined,
                max: a.max_salary ?? undefined,
                currency: "USD",
                period: "month",
            };
        }

        return {
            id: `getonbrd:${j.id}`,
            source: "getonbrd",
            title: a.title.trim(),
            company: a.company.data.attributes.name.trim(),
            url: j.links.public_url,
            workMode: toWorkMode(a.remote_modality),
            locations: a.countries,
            seniority: SENIORITY[a.seniority.data.attributes.locale_key],
            salary,
            tags: a.tags.data.map((t) => t.attributes.name),
            // epoch en segundos × 1000 = milisegundos, que es lo que espera Date.
            postedAt: new Date(a.published_at * 1000).toISOString(),
        };
    });
}

// ── 4. Descargar ──────────────────────────────────────────────────────────

const BASE = "https://www.getonbrd.com/api/v0/categories";
const CATEGORIES = ["programming", "sysadmin-devops-qa"]; // ver todas: /api/v0/categories
const PER_PAGE = 100;
const MAX_PAGES = 5; // tope de seguridad: nunca más de 5 peticiones por categoría

export const getonbrd: Source<GobResponse> = {
    id: "getonbrd",

    async fetchRaw() {
        const all: GobJob[] = [];
        for (const category of CATEGORIES) {
            for (let page = 1; page <= MAX_PAGES; page++) {
                const url =
                    `${BASE}/${category}/jobs?per_page=${PER_PAGE}&page=${page}` +
                    "&expand[]=company&expand[]=tags&expand[]=seniority";
                const res = await fetchJson<GobResponse>(url);
                all.push(...res.data);
                // Si la página vino incompleta, ya no hay más: dejamos de pedir.
                if (res.data.length < PER_PAGE) break;
            }
        }
        // Devolvemos el mismo formato que la API para que normalize() no cambie.
        return { data: all, meta: { page: 1, per_page: all.length, total_pages: 1 } };
    },

    normalize: normalizeGetonbrd,
};
