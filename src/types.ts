// El "contrato" del proyecto: todas las fuentes, sin importar cómo vengan sus
// datos, se convierten a este mismo formato. Así el resto del sistema
// (filtros, página, Telegram) nunca tiene que saber de qué API vino una vacante.
//
// Es la misma idea que un DTO en Laravel o un Resource de API: un solo shape
// estable hacia adentro, aunque afuera cada proveedor hable distinto.

export type SourceId = "getonbrd" | "remoteok" | "remotive";

/** Cómo se trabaja. "unknown" existe para no inventar datos que la fuente no da. */
export type WorkMode = "remote" | "hybrid" | "onsite" | "unknown";

export type Seniority = "trainee" | "junior" | "semi-senior" | "senior" | "expert";

export interface Salary {
    min?: number;
    max?: number;
    currency: "USD";
    period: "month" | "year";
}

export interface Job {
    /** Único en todo el sistema: `${source}:${id de la fuente}` */
    id: string;
    source: SourceId;
    title: string;
    company: string;
    /** Enlace a la publicación ORIGINAL. Las APIs exigen enlazar de vuelta (ver ADR-002). */
    url: string;
    workMode: WorkMode;
    /** Países o regiones tal como los publica la fuente ("Chile", "Worldwide", "LATAM"...). */
    locations: string[];
    seniority?: Seniority;
    /** Salario estructurado, solo cuando la fuente lo da en números. */
    salary?: Salary;
    /** Salario en texto libre cuando la fuente no lo estructura (p. ej. "$25k - $35k"). */
    salaryText?: string;
    tags: string[];
    /** Fecha de publicación en ISO 8601 con zona horaria UTC (termina en "Z"). */
    postedAt: string;
}

/**
 * Lo que debe cumplir cada fuente. `fetchJobs` descarga y `normalize` traduce.
 * Se separan a propósito: `normalize` es una función PURA (mismo input → mismo
 * output, sin red), así que se puede probar con datos guardados en test/fixtures.
 */
export interface Source<Raw = unknown> {
    id: SourceId;
    fetchRaw(): Promise<Raw>;
    normalize(raw: Raw): Job[];
}
