import { ParsedMessage } from "../interfaces/ParsedMessage";

const messageRegex =
  /^\[(.*)\]:\[([A-Za-z0-9]*)_([A-Za-z0-9]*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]/;

export function parseMessage(message: string): ParsedMessage | null {
  const found = message.match(messageRegex);
  if (!found) return null;

  return {
    time: found[6],
    id: found[4],
    to: found[3],
    from: found[2],
    text: found[5],
  };
}
