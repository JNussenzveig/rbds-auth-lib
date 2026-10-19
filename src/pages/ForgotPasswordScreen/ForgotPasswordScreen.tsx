'use client';

import React, { useEffect, useState } from "react";
import type { ForgotPasswordScreenProps } from "../../types";
import { sendResetCode } from "../../services/password-reset";
import { AuthLayout } from "../../components/AuthLayout";
import {
  BackLink,
  ErrorAlert,
  SubmitButton,
  SuccessAlert,
  getErrorMessage,
} from "../../components/FormParts";
import { MailIcon, ShieldIcon } from "../../components/icons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultHighlights = [
  {
    icon: <MailIcon />,
    title: "Receba um código por e-mail",
    text: "Enviaremos um código de recuperação para o e-mail cadastrado na sua conta.",
  },
  {
    icon: <ShieldIcon />,
    title: "Nunca pediremos sua senha",
    text: "A equipe de tecnologia nunca pedirá sua senha, não compartilhe com ninguém.",
  },
];

export function ForgotPasswordScreen({
  baseUrl,
  redirectUri,
  logo,
  texts,
  highlights = defaultHighlights,
  className,
  externalError,
  loginHref,
  onBackToLogin,
  onSubmit,
  onSuccess,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const t = {
    badge: texts?.badge ?? "RBDS",
    title: texts?.title ?? "Recuperar acesso",
    subtitle:
      texts?.subtitle ??
      "Esqueceu sua senha? Sem problemas — vamos te ajudar a voltar para os sistemas da RBDS.",
    cardTitle: texts?.cardTitle ?? "Esqueci minha senha",
    cardDescription:
      texts?.cardDescription ??
      "Informe seu e-mail e enviaremos um código de recuperação.",
    emailLabel: texts?.emailLabel ?? "E-mail",
    emailPlaceholder: texts?.emailPlaceholder ?? "voce@exemplo.com",
    submitText: texts?.submitText ?? "Enviar código",
    loadingText: texts?.loadingText ?? "Enviando…",
    successTitle: texts?.successTitle ?? "Verifique seu e-mail",
    successMessage:
      texts?.successMessage ??
      "Se houver uma conta associada a este e-mail, você receberá um código de recuperação em instantes.",
    resendText: texts?.resendText ?? "Usar outro e-mail",
    backToLoginText: texts?.backToLoginText ?? "Voltar para o login",
    footerText: texts?.footerText ?? `© ${new Date().getFullYear()} RBDS`,
  };

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const value = email.trim();
    if (!value) return setError("O e-mail é obrigatório.");
    if (!EMAIL_REGEX.test(value)) return setError("Informe um e-mail válido.");

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(value);
      } else {
        if (!baseUrl) throw new Error("A baseUrl não foi informada.");
        if (!redirectUri) throw new Error("A redirectUri não foi informada.");

        const result = await sendResetCode({
          baseUrl,
          redirectUri,
          email: value,
        });

        if (!result.success) {
          throw new Error(result.error);
        }
      }

      setSent(true);
      onSuccess?.(value);
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível enviar o código. Tente novamente."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      badge={t.badge}
      title={t.title}
      subtitle={t.subtitle}
      footerText={t.footerText}
      cardTitle={t.cardTitle}
      cardDescription={t.cardDescription}
      logo={logo}
      highlights={highlights}
      className={className}
    >
      {sent ? (
        <div className="rbds-login-form rbds-login-step">
          <SuccessAlert title={t.successTitle} message={t.successMessage} />
          <button
            type="button"
            className="rbds-login-secondary"
            onClick={() => setSent(false)}
          >
            {t.resendText}
          </button>
          <BackLink text={t.backToLoginText} href={loginHref} onClick={onBackToLogin} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rbds-login-form rbds-login-step" noValidate>
          <div className="rbds-login-field">
            <label htmlFor="rbds-email" className="rbds-login-label">
              {t.emailLabel}
            </label>
            <input
              id="rbds-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              disabled={isLoading}
              className="rbds-login-input"
            />
          </div>

          <ErrorAlert message={error} />

          <SubmitButton isLoading={isLoading} text={t.submitText} loadingText={t.loadingText} />

          <BackLink text={t.backToLoginText} href={loginHref} onClick={onBackToLogin} />
        </form>
      )}
    </AuthLayout>
  );
}
