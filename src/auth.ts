import type {
  StartOAuthLoginOptions,
  OAuthTokenOptions,
  RefreshTokenOptions,
  OAuthTokenResult,
} from "./types";
import { generatePKCE } from "./auth-pkce";

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
export async function startOAuthLogin(
  options: StartOAuthLoginOptions
): Promise<string> {
  const { verifier, challenge } = await generatePKCE();

  if (typeof window !== "undefined" && window.sessionStorage) {
    sessionStorage.setItem("pkce_code_verifier", verifier);
  }

  const params = new URLSearchParams({
    response_type: options.responseType ?? "code",
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    code_challenge: challenge,
    code_challenge_method: "S256",
    username: options.username ?? "",
    password: options.password ?? "",
  });

  const targetUrl = `${options.authUrl}?${params.toString()}`;

  return targetUrl;
}

/**
 * Exchanges an authorization code, refresh token, or credentials for JWT access tokens
 * by making a POST request to /oauth/token.
 *
 * @param options - Token request options including clientId, code, redirectUri, codeVerifier, etc.
 * @returns A result object containing access_token, refresh_token, etc., or error details.
 *
 */
export async function getOAuthToken(
  options: OAuthTokenOptions
): Promise<OAuthTokenResult> {
  try {
    let verifier = options.codeVerifier;
    if (!verifier && typeof window !== "undefined" && window.sessionStorage) {
      verifier = sessionStorage.getItem("pkce_code_verifier") || undefined;
    }

    const params = new URLSearchParams({
      grant_type: options.grantType ?? "authorization_code",
      client_id: options.clientId,
      code: options.code,
      redirect_uri: options.redirectUri,
      code_verifier: verifier ?? "",
    });

    const response = await fetch(options.authUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return { success: false, error: error?.error || error?.error_description || "Erro ao obter token" };
    }

    const success = await response.json();
    if (success) {
      return {
        success: true,
        access_token: success.access_token,
        token_type: success.token_type,
        expires_in: success.expires_in,
        refresh_token: success.refresh_token,
      };
    }
    return { success: false, error: "Erro desconhecido" };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível conectar ao servidor de token.";
    return { success: false, error: message };
  } finally {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem("pkce_code_verifier");
    }
  }
}

/**
 * Refreshes an expired JWT access token using a refresh token.
 *
 * @param options - Refresh token options including authUrl, clientId, and refreshToken.
 * @returns A result object containing the new access_token, token_type, expires_in, refresh_token or error.
 */
export async function refreshToken(
  options: RefreshTokenOptions
): Promise<OAuthTokenResult> {
  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: options.clientId,
      refresh_token: options.refreshToken,
    });

    const response = await fetch(options.authUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return {
        success: false,
        error: error?.error || error?.error_description || "Erro ao renovar token",
      };
    }

    const success = await response.json();
    return {
      success: true,
      access_token: success.access_token,
      token_type: success.token_type,
      expires_in: success.expires_in,
      refresh_token: success.refresh_token,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Não foi possível conectar ao servidor para renovar o token.";
    return { success: false, error: message };
  }
}
