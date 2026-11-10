// Registro de fuentes. Para agregar una nueva (Himalayas, Jobicy, WWR...),
// creas su archivo con el mismo patrón y la sumas a esta lista. Nada más cambia.

import type { Source } from "../types";
import { getonbrd } from "./getonbrd";
import { remoteok } from "./remoteok";
import { remotive } from "./remotive";

export const sources: Source<any>[] = [getonbrd, remoteok, remotive];
