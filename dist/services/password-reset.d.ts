import type { PasswordResetResult, ResetPasswordOptions, SendResetCodeOptions, ValidateResetCodeOptions } from "../types";
/**
 * Envia o código de recuperação para o e-mail do usuário.
 * Endpoint: POST /api/auth/password/send-code
 */
export declare function sendResetCode(options: SendResetCodeOptions): Promise<PasswordResetResult>;
/**
 * Valida se um código de recuperação é válido, não expirou e não foi utilizado.
 * Endpoint: POST /api/auth/password/validate-code
 */
export declare function validateResetCode(options: ValidateResetCodeOptions): Promise<PasswordResetResult>;
/**
 * Redefine a senha do usuário com o código validado.
 * Endpoint: POST /api/auth/password/reset
 */
export declare function resetPassword(options: ResetPasswordOptions): Promise<PasswordResetResult>;
//# sourceMappingURL=password-reset.d.ts.map