/**
 * Gate for `/api/debug/*` routes. Only exact `true` (after trim, case-insensitive) enables them.
 */
export function isDebugEndpointsEnabled(): boolean {
  return process.env.DEBUG_ENDPOINTS_ENABLED?.trim().toLowerCase() === "true";
}
