import { v4 as uuidv4 } from "uuid";

export function createKey(filename: string) {
  const ext = filename.slice(filename.lastIndexOf(".") + 1);
  const key = `${uuidv4()}.${ext}`;
  return key;
}
