import { ParsedMessage } from "../interfaces/ParsedMessage";

const historyRegex =
  /^\[(.*)\]:\[([A-Za-z0-9]*)_([A-Za-z0-9]*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]/;

export function parseHistory(message: string): ParsedMessage | null {
  const found = message.match(historyRegex);
  if (!found || found[1] !== "history") return null;

  return {
    time: found[6],
    id: found[4],
    to: found[3],
    from: found[2],
    text: found[5],
  };
}
