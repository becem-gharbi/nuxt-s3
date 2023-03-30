import { v4 as uuidv4 } from "uuid";
import type { MultiPartData } from "../../types";

export function createKey(multipartData: MultiPartData) {
  const ext = multipartData.type ? multipartData.type.split("/").pop() : "blob";

  const key = `${uuidv4()}.${ext}`;

  return key;
}
