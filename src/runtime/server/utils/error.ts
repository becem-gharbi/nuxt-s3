import { ZodError } from "zod";
import { createError, H3Error } from "h3";

export function handleError(error: any) {
  const h3Error = new H3Error();

  if (error instanceof ZodError) {
    h3Error.message = error.issues[0].path + " | " + error.issues[0].message;
    h3Error.statusCode = 400;
  } else if (error.message === "unauthorized") {
    h3Error.message = "unauthorized";
    h3Error.statusCode = 401;
  } else {
    h3Error.message = error.message;
    h3Error.statusCode = 400;
  }

  throw createError(h3Error);
}
