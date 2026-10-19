'use client';

import React, { useEffect, useState } from "react";
import type { LoginScreenProps } from "../../types";
import { startOAuthLogin } from "../../services/auth";
import { AuthLayout } from "../../components/AuthLayout";
import { ErrorAlert, ForgotPasswordLink, PasswordField, SubmitButton, getErrorMessage } from "../../components/FormParts";
import { LinkIcon, ShieldIcon } from "../../components/icons";

// ── Simple validation (no zod dependency) ────────────

function validate(username: string, password: string): string | null {
  if (!username.trim()) return "O usuário é obrigatório.";
  if (!password) return "A senha é obrigatória.";
  return null;
}

// ── Default values ───────────────────────────────────

const defaultHighlights = [
  {
    icon: <LinkIcon />,
    title: "Acesso unificado",
    text: "Uma única conta para todos os sistemas da Rede Brasileira de Desenvolvimento Social.",
  },
  {
    icon: <ShieldIcon />,
    title: "Autenticação segura",
    text: "Suas credenciais são protegidas com criptografia e sessões controladas.",
  },
];

// ── Component ────────────────────────────────────────

export function LoginScreen({
  logo,
  texts,
  highlights = defaultHighlights,
  onSubmit,
  authUrl,
  clientId,
  redirectUri,
  className,
  externalError,
  forgotPasswordHref,
  onForgotPassword,
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const targetForgotPasswordHref = forgotPasswordHref;
  const shouldShowForgotPassword = Boolean(targetForgotPasswordHref || onForgotPassword);

  const t = {
    badge: texts?.badge ?? "RBDS",
    title: texts?.title ?? "Login Integrado",
    subtitle: texts?.subtitle ?? "Acesse os sistemas da Rede Brasileira de Desenvolvimento Social com suas credenciais unificadas.",
    cardTitle: texts?.cardTitle ?? "Entrar",
    cardDescription: texts?.cardDescription ?? "Use suas credenciais da RBDS para continuar.",
    usernameLabel: texts?.usernameLabel ?? "Usuário",
    usernamePlaceholder: texts?.usernamePlaceholder ?? "Usuário",
    passwordLabel: texts?.passwordLabel ?? "Senha",
    passwordPlaceholder: texts?.passwordPlaceholder ?? "••••••••",
    submitText: texts?.submitText ?? "Entrar",
    loadingText: texts?.loadingText ?? "Entrando…",
    forgotPasswordText: texts?.forgotPasswordText ?? "Esqueceu a senha?",
    footerText: texts?.footerText ?? `© ${new Date().getFullYear()} RBDS`,
  };

  useEffect(() => {
    if (externalError && externalError.length > 0) {
      setError(externalError);
    }
  }, [externalError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validate(username, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({ username, password });
      } else if (!!authUrl && !!clientId && !!redirectUri) {
        const redirectUrl = await startOAuthLogin({
          authUrl,
          clientId,
          redirectUri,
          username,
          password,
        });
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível entrar. Tente novamente."));
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
      <form onSubmit={handleSubmit} className="rbds-login-form">
        {/* Username */}
        <div className="rbds-login-field">
          <label htmlFor="rbds-username" className="rbds-login-label">
            {t.usernameLabel}
          </label>
          <input
            id="rbds-username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.usernamePlaceholder}
            required
            disabled={isLoading}
            className="rbds-login-input"
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <PasswordField
          id="rbds-password"
          label={t.passwordLabel}
          value={password}
          onChange={setPassword}
          placeholder={t.passwordPlaceholder}
          disabled={isLoading}
          autoComplete="current-password"
          action={
            shouldShowForgotPassword ? (
              <ForgotPasswordLink
                text={t.forgotPasswordText}
                href={targetForgotPasswordHref}
                onClick={onForgotPassword}
                disabled={isLoading}
              />
            ) : undefined
          }
        />

        <ErrorAlert message={error} />

        <SubmitButton isLoading={isLoading} text={t.submitText} loadingText={t.loadingText} />
      </form>
    </AuthLayout>
  );
}
