import type { OAuthTokenOptions, OAuthTokenResult, RefreshTokenOptions, StartOAuthLoginOptions } from "../types";
/**
 * Initiates the PKCE OAuth login process by generating code challenge/verifier
 * and returns the authorization URL with all required query params.
 */
export declare function startOAuthLogin(options: StartOAuthLoginOptions): Promise<string>;
/**
 * Exchanges an authorization code for JWT access tokens by making a POST request to the token endpoint.
 */
export declare function getOAuthToken(options: OAuthTokenOptions): Promise<OAuthTokenResult>;
/**
 * Refreshes an expired JWT access token using a refresh token.
 */
export declare function refreshToken(options: RefreshTokenOptions): Promise<OAuthTokenResult>;
//# sourceMappingURL=auth.d.ts.map