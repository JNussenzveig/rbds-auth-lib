/**
 * Encodes a Uint8Array into a Base64-URL string (RFC 4648 §5).
 */
export declare function base64UrlEncode(buffer: Uint8Array): string;
/**
 * Generates a PKCE code verifier and code challenge pair using SHA-256.
 * Stores values compatible with Web Crypto API across browsers and Node.js environments.
 */
export declare function generatePKCE(): Promise<{
    verifier: string;
    challenge: string;
}>;
//# sourceMappingURL=auth-pkce.d.ts.map