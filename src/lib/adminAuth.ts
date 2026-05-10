/**
 * Client-side admin auth check.
 * Returns true if the current session is authenticated.
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/auth", { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
