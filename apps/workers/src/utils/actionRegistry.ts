import { sendWebhook } from "../services/sendConsole.js";
import { sendEmail } from "../services/sendEmail.js";
import { sendConsole } from "../services/sendWebhook.js";

export const actionRegistry: Record<string, Function> = {
  mail: sendEmail,
  webhook: sendWebhook,
  console: sendConsole,
};
