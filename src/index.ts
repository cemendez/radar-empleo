// Punto de entrada. Flujo de la v0.1:
//   1. Pedir datos a todas las fuentes EN PARALELO
//   2. Normalizar cada una a Job[]
//   3. Quitar duplicados y ordenar por fecha
//   4. Guardar data/jobs.json (o solo mostrar, con --dry-run)

import { mkdirSync, writeFileSync } from "node:fs";
import { dedupe } from "./dedupe";
import { sources } from "./sources";
import type { Job } from "./types";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
    const started = Date.now();

    // Promise.allSettled (y no Promise.all): si UNA fuente falla, las demás siguen.
    // Es la lección del 21 de octubre en radar-tech: un solo punto de falla
    // no debe tumbar todo el sistema.
    const results = await Promise.allSettled(
        sources.map(async (source) => {
            const raw = await source.fetchRaw();
            return { id: source.id, jobs: source.normalize(raw) };
        }),
    );

    const all: Job[] = [];
    results.forEach((result, i) => {
        const id = sources[i]!.id;
        if (result.status === "fulfilled") {
            console.log(`✔ ${id}: ${result.value.jobs.length} vacantes`);
            all.push(...result.value.jobs);
        } else {
            const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
            console.log(`✘ ${id}: ${reason}`);
        }
    });

    const { unique, duplicates } = dedupe(all);
    unique.sort((a, b) => b.postedAt.localeCompare(a.postedAt)); // ISO se ordena como texto

    const byMode = Object.groupBy(unique, (job) => job.workMode);
    const withSalary = unique.filter((job) => job.salary || job.salaryText).length;

    console.log(`\nTotal: ${unique.length} vacantes únicas (${duplicates} duplicadas descartadas)`);
    console.log(
        `Modalidad: ${Object.entries(byMode)
            .map(([mode, jobs]) => `${mode} ${jobs?.length}`)
            .join(" · ")}`,
    );
    console.log(`Con salario publicado: ${withSalary}`);
    console.log(`Tiempo: ${((Date.now() - started) / 1000).toFixed(1)} s`);

    console.log("\nLas 5 más recientes:");
    for (const job of unique.slice(0, 5)) {
        console.log(`  · [${job.source}] ${job.title} — ${job.company} (${job.workMode}, ${job.locations.join(", ") || "sin zona"})`);
    }

    if (DRY_RUN) {
        console.log("\nDRY RUN: no se escribió ningún archivo.");
        return;
    }

    mkdirSync("data", { recursive: true });
    writeFileSync("data/jobs.json", `${JSON.stringify(unique, null, 2)}\n`);
    console.log("\nGuardado en data/jobs.json");
}

main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
});
