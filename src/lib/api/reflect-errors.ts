import { NextResponse } from "next/server";

export type ReflectErrorCode =
  | "missing_env"
  | "auth_failed"
  | "rate_limited"
  | "validation_failed"
  | "ai_failed"
  | "db_insert_failed";

type ReflectErrorBody = {
  error: string;
  code: ReflectErrorCode;
};

export function reflectJsonError(
  message: string,
  code: ReflectErrorCode,
  status: number,
  init?: ResponseInit,
): NextResponse<ReflectErrorBody> {
  const body: ReflectErrorBody = { error: message, code };
  return NextResponse.json(body, { ...init, status });
}
