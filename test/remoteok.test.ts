// ESPECIFICACIÓN del Ejercicio 1. Estas pruebas fallan hasta que implementes
// normalizeRemoteOk en src/sources/remoteok.ts. No las cambies: cambia el código.

import { beforeAll, describe, expect, it } from "vitest";
import type { Job } from "../src/types";
import { normalizeRemoteOk } from "../src/sources/remoteok";
import fixture from "./fixtures/remoteok.json";

describe("remoteok", () => {
    let jobs: Job[] = [];
    beforeAll(() => {
        jobs = normalizeRemoteOk(fixture);
    });

    it("ignora el aviso legal del índice 0", () => {
        expect(jobs).toHaveLength(2);
    });

    it("arma id, título, empresa y url", () => {
        expect(jobs[0]).toMatchObject({
            id: "remoteok:1137703",
            source: "remoteok",
            title: "Account Executive Enterprise",
            company: "Harvey",
            url: expect.stringMatching(/^https:\/\/remoteOK\.com\/remote-jobs\//),
        });
    });

    it("marca todas como remotas", () => {
        expect(jobs.every((j) => j.workMode === "remote")).toBe(true);
    });

    it("salario: USD anual cuando existe, y sin salario cuando viene en 0", () => {
        expect(jobs[0]!.salary).toEqual({ min: 380000, max: 420000, currency: "USD", period: "year" });
        expect(jobs[1]!.salary).toBeUndefined();
    });

    it("locations: texto en arreglo, o arreglo vacío si no hay ubicación", () => {
        expect(jobs[0]!.locations).toEqual([]);
        expect(jobs[1]!.locations).toEqual(["Houston"]);
    });

    it("postedAt en ISO UTC", () => {
        expect(jobs[1]!.postedAt).toBe("2026-11-08T16:00:15.000Z");
    });

    it("conserva los tags", () => {
        expect(jobs[0]!.tags).toContain("saas");
    });
});
