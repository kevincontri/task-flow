import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW para o ambiente de testes (Node). O browser.ts (setupWorker) é só pro dev.
export const server = setupServer(...handlers);
