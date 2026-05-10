import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  exp: number;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signaturesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSessionToken(now = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) return null;

  const payload = base64UrlEncode(
    JSON.stringify({
      exp: now + SESSION_MAX_AGE_SECONDS * 1000,
    } satisfies AdminSessionPayload)
  );
  return `${payload}.${signPayload(payload, secret)}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = signPayload(payload, secret);
  if (!signaturesMatch(signature, expected)) return false;

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as AdminSessionPayload;
    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_SECONDS;
