// Pruebas del ejemplo resuelto. Léelas junto con src/sources/getonbrd.ts:
// cada `expect` documenta una decisión de diseño.

import { describe, expect, it } from "vitest";
import { normalizeGetonbrd, type GobResponse } from "../src/sources/getonbrd";
import fixture from "./fixtures/getonbrd.json";

const jobs = normalizeGetonbrd(fixture as unknown as GobResponse);

describe("getonbrd", () => {
    it("convierte todas las vacantes del fixture", () => {
        expect(jobs).toHaveLength(3);
    });

    it("arma el id con el prefijo de la fuente y conserva la URL original", () => {
        expect(jobs[0]!.id).toMatch(/^getonbrd:/);
        expect(jobs[0]!.url).toMatch(/^https:\/\/www\.getonbrd\.com\/jobs\//);
    });

    it("traduce la modalidad a nuestro vocabulario", () => {
        expect(jobs.map((j) => j.workMode)).toEqual(["hybrid", "remote", "onsite"]);
    });

    it("traduce el seniority", () => {
        expect(jobs.map((j) => j.seniority)).toEqual(["semi-senior", "senior", "semi-senior"]);
    });

    it("interpreta el salario como USD mensual", () => {
        expect(jobs[1]!.salary).toEqual({ min: 4500, max: 6000, currency: "USD", period: "month" });
    });

    it("convierte el epoch en segundos a ISO UTC", () => {
        expect(jobs[0]!.postedAt).toBe(new Date(1794227297 * 1000).toISOString());
        expect(jobs[0]!.postedAt.endsWith("Z")).toBe(true);
    });

    it("toma los nombres de tags y empresa del expand", () => {
        expect(jobs[0]!.company).toBe("23people");
        expect(jobs[0]!.tags.length).toBeGreaterThan(0);
        expect(typeof jobs[0]!.tags[0]).toBe("string");
    });
});
