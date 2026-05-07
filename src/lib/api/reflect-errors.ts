import { NextResponse } from "next/server";

export type ReflectErrorCode =
  | "missing_env"
  | "auth_failed"
  | "rate_limited"
  | "validation_failed"
  | "ai_failed"
  | "db_insert_failed";

export type ReflectErrorBody = {
  ok: false;
  code: ReflectErrorCode;
  message: string;
};

export function reflectJsonError(
  message: string,
  code: ReflectErrorCode,
  status: number,
  init?: ResponseInit,
): NextResponse<ReflectErrorBody> {
  const body: ReflectErrorBody = { ok: false, code, message };
  return NextResponse.json(body, { ...init, status });
}
