import type {
  PasswordResetResult,
  ResetPasswordOptions,
  SendResetCodeOptions,
  ValidateResetCodeOptions,
} from "../types";

const ERROR_TRANSLATIONS: Record<string, string> = {
  "too many requests": "Limite de tentativas excedido. Tente novamente em 1 hora.",
  "code not found": "Código de verificação não encontrado.",
  "code already used": "Este código já foi utilizado.",
  "code expired": "Este código expirou (validade de 15 minutos). Solicite um novo.",
  "Confirm does not match Password": "A confirmação não coincide com a nova senha.",
};

async function parseResponseError(response: Response, fallback: string): Promise<string> {
  let message = fallback;
  try {
    const data = await response.json();
    if (data && typeof data === "object") {
      message = data.error || data.message || data.detail || fallback;
    }
  } catch {
    const text = await response.text().catch(() => "");
    if (text) message = text;
  }

  // Tradução de mensagens padrão da API para melhor UX
  for (const [key, translated] of Object.entries(ERROR_TRANSLATIONS)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return translated;
    }
  }

  return message;
}

/**
 * Envia o código de recuperação para o e-mail do usuário.
 * Endpoint: POST /api/auth/password/send-code
 */
export async function sendResetCode(
  options: SendResetCodeOptions
): Promise<PasswordResetResult> {
  const base = options.baseUrl;
  if (!base) {
    return { success: false, error: "URL base não configurada." };
  }

  const redirectUri = options.redirectUri;
  if (!redirectUri) {
    return { success: false, error: "redirectUri é obrigatório." };
  }

  try {
    const response = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: options.email.trim(),
        redirect_uri: redirectUri.trim(),
      }),
    });

    if (!response.ok) {
      const errorMsg = await parseResponseError(
        response,
        "Não foi possível enviar o código de recuperação."
      );
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro de conexão ao solicitar código de recuperação.";
    return { success: false, error: message };
  }
}

/**
 * Valida se um código de recuperação é válido, não expirou e não foi utilizado.
 * Endpoint: POST /api/auth/password/validate-code
 */
export async function validateResetCode(
  options: ValidateResetCodeOptions
): Promise<PasswordResetResult> {
  const base = options.baseUrl;
  if (!base) {
    return { success: false, error: "URL base não configurada." };
  }

  const code = options.code.trim().toUpperCase();
  if (!code) {
    return { success: false, error: "Código de verificação é obrigatório." };
  }

  try {
    const response = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorMsg = await parseResponseError(
        response,
        "Código de recuperação inválido ou expirado."
      );
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro de conexão ao validar o código.";
    return { success: false, error: message };
  }
}

/**
 * Redefine a senha do usuário com o código validado.
 * Endpoint: POST /api/auth/password/reset
 */
export async function resetPassword(
  options: ResetPasswordOptions
): Promise<PasswordResetResult> {
  const base = options.baseUrl;
  if (!base) {
    return { success: false, error: "URL base não configurada." };
  }

  const code = options.code.trim().toUpperCase();
  if (!code) {
    return { success: false, error: "Código de verificação é obrigatório." };
  }

  if (!options.redirectUri || options.redirectUri.length < 6) {
    return { success: false, error: "A Redirect URI não foi enviada." };
  }

  if (!options.password || options.password.length < 6) {
    return { success: false, error: "A senha deve ter no mínimo 6 caracteres." };
  }

  if (options.password !== options.confirm) {
    return { success: false, error: "A confirmação de senha não confere." };
  }

  try {
    const response = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code,
        password: options.password,
        confirm: options.confirm,
        redirect_uri: options.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorMsg = await parseResponseError(
        response,
        "Não foi possível redefinir a senha."
      );
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro de conexão ao redefinir a senha.";
    return { success: false, error: message };
  }
}
