import type { StartOAuthLoginOptions, OAuthTokenOptions, RefreshTokenOptions, OAuthTokenResult } from "./types";
/**
 * Initiates an OAuth PKCE authorization request (/oauth/authorize).
 *
 * Generates code_verifier & code_challenge, stores them in sessionStorage,
 * performs the authorization request, validates HTTP 400 errors (invalid client/uri),
 * and handles redirects or returns the single-use authorization code.
 *
 * @param options - Configuration options including clientId, redirectUri, username, password, etc.
 * @returns An object representing success with authorization code or error details.
 */
export declare function startOAuthLogin(options: StartOAuthLoginOptions): Promise<string>;
/**
 * Exchanges an authorization code, refresh token, or credentials for JWT access tokens
 * by making a POST request to /oauth/token.
 *
 * @param options - Token request options including clientId, code, redirectUri, codeVerifier, etc.
 * @returns A result object containing access_token, refresh_token, etc., or error details.
 *
 */
export declare function getOAuthToken(options: OAuthTokenOptions): Promise<OAuthTokenResult>;
/**
 * Refreshes an expired JWT access token using a refresh token.
 *
 * @param options - Refresh token options including authUrl, clientId, and refreshToken.
 * @returns A result object containing the new access_token, token_type, expires_in, refresh_token or error.
 */
export declare function refreshToken(options: RefreshTokenOptions): Promise<OAuthTokenResult>;
//# sourceMappingURL=auth.d.ts.map