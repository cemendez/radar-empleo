// ESPECIFICACIÓN del Ejercicio 2. Fallan hasta que implementes normalizeRemotive.

import { beforeAll, describe, expect, it } from "vitest";
import type { Job } from "../src/types";
import { normalizeRemotive, type RemotiveResponse } from "../src/sources/remotive";
import fixture from "./fixtures/remotive.json";

describe("remotive", () => {
    let jobs: Job[] = [];
    beforeAll(() => {
        jobs = normalizeRemotive(fixture as unknown as RemotiveResponse);
    });

    it("convierte las vacantes", () => {
        expect(jobs).toHaveLength(2);
        expect(jobs[1]).toMatchObject({
            id: "remotive:2091045",
            source: "remotive",
            title: "Tier III Service Desk Engineer",
            company: "Unio Digital",
            workMode: "remote",
        });
    });

    it("locations: separa la lista de regiones desde donde se puede trabajar", () => {
        expect(jobs[0]!.locations).toEqual(["USA"]);
        expect(jobs[1]!.locations).toEqual(["Worldwide"]);
    });

    it("salario en texto libre va en salaryText, no en salary", () => {
        expect(jobs[0]!.salaryText).toBe("$25k - $35k");
        expect(jobs[0]!.salary).toBeUndefined();
        expect(jobs[1]!.salaryText).toBeUndefined();
    });

    it("TRAMPA de zona horaria: la fecha sin zona se interpreta como UTC", () => {
        // Esta prueba solo pasa si NO dependes de la zona horaria de tu computadora.
        expect(jobs[0]!.postedAt).toBe("2026-11-06T08:51:01.000Z");
    });
});
