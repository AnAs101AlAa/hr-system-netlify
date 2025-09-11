import { setupWorker } from "msw/browser";
import { formHandlers } from "./handlers/formHandlers";
export const worker = setupWorker(...formHandlers);
