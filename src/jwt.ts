import { Jwt } from "./types";

/**
 * Decodes the payload portion of a JWT token string.
 */
export function decodeJwt(token: string): Jwt | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    let jsonPayload: string;
    if (typeof globalThis !== 'undefined' && 'Buffer' in globalThis) {
      jsonPayload = (globalThis as any).Buffer.from(base64, 'base64').toString('utf-8');
    } else if (typeof atob === 'function') {
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else {
      return null;
    }

    return JSON.parse(jsonPayload) as Jwt;
  } catch {
    return null;
  }
}
