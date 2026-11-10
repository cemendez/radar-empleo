// Un solo lugar para hacer peticiones HTTP. Si mañana hay que agregar
// reintentos, caché o cambiar el User-Agent, se cambia aquí y no en cada fuente.

const TIMEOUT_MS = 20_000;

// Identificarse es de buena educación con APIs públicas: si algo sale mal,
// el dueño del sitio sabe quién eres en lugar de bloquearte a ciegas.
const USER_AGENT = "radar-empleo/0.1 (buscador personal; github.com/cemendez/radar-empleo)";

export async function fetchJson<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        // Si la petición tarda más de TIMEOUT_MS, se cancela en vez de colgar el proceso.
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} en ${url}: ${(await res.text()).slice(0, 200)}`);
    }
    return (await res.json()) as T;
}
