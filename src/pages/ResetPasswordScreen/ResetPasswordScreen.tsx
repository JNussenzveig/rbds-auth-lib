'use client';

import React, { useEffect, useRef, useState } from "react";
import type { ResetPasswordScreenProps } from "../../types";
import { resetPassword, validateResetCode } from "../../services/password-reset";
import { AuthLayout } from "../../components/AuthLayout";
import {
  BackLink,
  CodeInput,
  ErrorAlert,
  PasswordField,
  SubmitButton,
  SuccessAlert,
  getErrorMessage,
} from "../../components";
import { KeyIcon, ShieldIcon } from "../../components/icons";

type Step = "code" | "password" | "done";

const CODE_LENGTH = 6;

const defaultHighlights = [
  {
    icon: <KeyIcon />,
    title: "Código de recuperação",
    text: "Use o código enviado para o seu e-mail para confirmar sua identidade.",
  },
  {
    icon: <ShieldIcon />,
    title: "Crie uma senha forte",
    text: "Combine letras, números e símbolos. Evite reutilizar senhas antigas.",
  },
];

function readCodeFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("code") ?? "";
}

function normalizeCode(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, CODE_LENGTH);
}

function getPasswordRules(password: string, minLength: number) {
  return [
    { label: `Mínimo de ${minLength} caracteres`, valid: password.length >= minLength },
    { label: "Pelo menos uma letra", valid: /[a-zA-Z]/.test(password) },
    { label: "Pelo menos um número", valid: /\d/.test(password) },
    { label: "Pelo menos um caractere especial", valid: /[^a-zA-Z0-9]/.test(password) },
  ];
}

export function ResetPasswordScreen({
  codeUrl,
  resetUrl,
  logo,
  texts,
  highlights = defaultHighlights,
  className,
  externalError,
  loginHref,
  onBackToLogin,
  initialCode,
  redirectUri,
  minPasswordLength = 6,
  onVerifyCode,
  onResetPassword,
  onSuccess,
}: ResetPasswordScreenProps) {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isVerifyingRef = useRef(false);
  const autoVerifiedRef = useRef(false);

  const t = {
    badge: texts?.badge ?? "RBDS",
    title: texts?.title ?? "Redefinir senha",
    subtitle:
      texts?.subtitle ??
      "Confirme o código recebido e escolha uma nova senha para acessar os sistemas da RBDS.",
    footerText: texts?.footerText ?? `© ${new Date().getFullYear()} RBDS`,
    codeCardTitle: texts?.codeCardTitle ?? "Confirme o código",
    codeCardDescription:
      texts?.codeCardDescription ??
      "Digite o código de verificação de 6 caracteres enviado para o seu e-mail.",
    codeLabel: texts?.codeLabel ?? "Código de verificação",
    verifyText: texts?.verifyText ?? "Validar código",
    verifyingText: texts?.verifyingText ?? "Validando…",
    passwordCardTitle: texts?.passwordCardTitle ?? "Nova senha",
    passwordCardDescription:
      texts?.passwordCardDescription ?? "Defina sua nova senha para continuar.",
    passwordLabel: texts?.passwordLabel ?? "Nova senha",
    confirmPasswordLabel: texts?.confirmPasswordLabel ?? "Confirmar nova senha",
    passwordPlaceholder: texts?.passwordPlaceholder ?? "••••••••",
    submitText: texts?.submitText ?? "Redefinir senha",
    loadingText: texts?.loadingText ?? "Salvando…",
    successCardTitle: texts?.successCardTitle ?? "Tudo certo!",
    successCardDescription:
      texts?.successCardDescription ?? "Sua senha foi redefinida com sucesso.",
    successMessage:
      texts?.successMessage ?? "Redirecionando para o login…",
    backToLoginText: texts?.backToLoginText ?? "Voltar para o login",
  };

  const passwordRules = getPasswordRules(password, minPasswordLength);
  const isPasswordValid = passwordRules.every((r) => r.valid);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  // ── Validação do código ──
  const verifyCode = async (raw: string) => {
    const value = normalizeCode(raw);
    if (value.length !== CODE_LENGTH || isVerifyingRef.current) return;

    isVerifyingRef.current = true;
    setError("");
    setIsLoading(true);

    try {
      if (onVerifyCode) {
        await onVerifyCode(value);
      } else {
        if (!codeUrl) throw new Error("A codeUrl não foi informada.");
        const result = await validateResetCode({ baseUrl: codeUrl, code: value });
        if (!result.success) throw new Error(result.error);
      }
      setCode(value);
      setStep("password");
    } catch (err) {
      setCode("");
      setError(getErrorMessage(err, "Código inválido ou expirado."));
    } finally {
      setIsLoading(false);
      isVerifyingRef.current = false;
    }
  };

  // Código vindo da URL (?code=) ou initialCode: preenche e valida automaticamente (uma vez)
  useEffect(() => {
    if (autoVerifiedRef.current) return;

    const fromSource = normalizeCode(initialCode || readCodeFromUrl());
    if (!fromSource) return;

    setCode(fromSource);

    // Só dispara quando houver como validar
    if (!codeUrl && !onVerifyCode) return;

    autoVerifiedRef.current = true;
    if (fromSource.length === CODE_LENGTH) {
      verifyCode(fromSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, codeUrl, onVerifyCode]);

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  // Digitação manual: valida automaticamente ao completar 6 caracteres
  const handleCodeChange = (value: string) => {
    const normalized = normalizeCode(value);
    setError("");
    setCode(normalized);
    if (normalized.length === CODE_LENGTH) {
      verifyCode(normalized);
    }
  };

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError("Informe o código completo de 6 caracteres.");
      return;
    }
    verifyCode(code);
  };

  // ── Redefinição de senha ──
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("A senha não atende a todos os requisitos.");
      return;
    }
    if (password !== confirm) {
      setError("A confirmação de senha não confere.");
      return;
    }

    setIsLoading(true);
    try {
      if (onResetPassword) {
        await onResetPassword({ code, password, confirm });
      } else {
        if (!resetUrl) throw new Error("A resetUrl não foi informada.");
        const result = await resetPassword({
          baseUrl: resetUrl,
          code,
          password,
          confirm,
          redirectUri,
        });
        if (!result.success) throw new Error(result.error);
      }

      setStep("done");
      onSuccess?.();

      if (onBackToLogin) {
        onBackToLogin();
      } else if (loginHref) {
        window.location.href = loginHref;
      }
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível redefinir a senha. Tente novamente."));
    } finally {
      setIsLoading(false);
    }
  };

  const header = {
    code: { title: t.codeCardTitle, desc: t.codeCardDescription },
    password: { title: t.passwordCardTitle, desc: t.passwordCardDescription },
    done: { title: t.successCardTitle, desc: t.successCardDescription },
  }[step];

  return (
    <AuthLayout
      badge={t.badge}
      title={t.title}
      subtitle={t.subtitle}
      footerText={t.footerText}
      cardTitle={header.title}
      cardDescription={header.desc}
      logo={logo}
      highlights={highlights}
      className={className}
    >
      {step === "code" && (
        <form key="code" onSubmit={handleVerify} className="rbds-login-form rbds-login-step" noValidate>
          <div className="rbds-login-field">
            <label className="rbds-login-label" style={{ textAlign: "center" }}>
              {t.codeLabel}
            </label>
            <CodeInput value={code} onChange={handleCodeChange} disabled={isLoading} />
          </div>

          <ErrorAlert message={error} />

          <SubmitButton isLoading={isLoading} text={t.verifyText} loadingText={t.verifyingText} />

          <BackLink text={t.backToLoginText} href={loginHref} onClick={onBackToLogin} />
        </form>
      )}

      {step === "password" && (
        <form key="password" onSubmit={handleReset} className="rbds-login-form rbds-login-step" noValidate>
          <PasswordField
            id="rbds-new-password"
            label={t.passwordLabel}
            value={password}
            onChange={setPassword}
            placeholder={t.passwordPlaceholder}
            disabled={isLoading}
          />

          <ul className="rbds-password-rules" aria-live="polite">
            {passwordRules.map((rule) => (
              <li key={rule.label} className={rule.valid ? "is-valid" : ""}>
                <span className="rbds-password-rule-dot" aria-hidden="true" />
                {rule.label}
              </li>
            ))}
          </ul>

          <PasswordField
            id="rbds-confirm-password"
            label={t.confirmPasswordLabel}
            value={confirm}
            onChange={setConfirm}
            placeholder={t.passwordPlaceholder}
            disabled={isLoading}
          />
          {confirm.length > 0 && !passwordsMatch && (
            <p className="rbds-login-hint rbds-login-hint--error">As senhas não conferem.</p>
          )}

          <ErrorAlert message={error} />

          <SubmitButton isLoading={isLoading} text={t.submitText} loadingText={t.loadingText} />

          <BackLink text={t.backToLoginText} href={loginHref} onClick={onBackToLogin} />
        </form>
      )}

      {step === "done" && (
        <div key="done" className="rbds-login-form rbds-login-step">
          <SuccessAlert message={t.successMessage} />
        </div>
      )}
    </AuthLayout>
  );
}
