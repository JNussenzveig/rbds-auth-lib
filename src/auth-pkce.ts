/**
 * Encodes a Uint8Array into a Base64-URL string (RFC 4648 §5).
 */
export function base64UrlEncode(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Generates a PKCE code verifier and code challenge pair using SHA-256.
 * Stores values compatible with Web Crypto API across browsers and Node.js environments.
 */
export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const cryptoObj =
    typeof window !== "undefined" && window.crypto
      ? window.crypto
      : globalThis.crypto;

  if (!cryptoObj || !cryptoObj.getRandomValues || !cryptoObj.subtle) {
    throw new Error("Crypto API is not available in this environment.");
  }

  // 1. Generate random verifier string (32 bytes -> 43 base64url characters)
  const array = new Uint8Array(32);
  cryptoObj.getRandomValues(array);
  const verifier = base64UrlEncode(array);

  // 2. SHA-256 hash the verifier
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await cryptoObj.subtle.digest("SHA-256", data);
  const challenge = base64UrlEncode(new Uint8Array(hash));

  return { verifier, challenge };
}
