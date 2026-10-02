'use client';

import React, { useEffect, useState } from "react";
import type { LoginScreenProps } from "./types";
import "./LoginScreen.css";
import { startOAuthLogin } from "./auth";

// ── Inline SVG icons (no lucide dependency) ──────────

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="rbds-login-spinner"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ── Simple validation (no zod dependency) ────────────

function validate(
  username: string,
  password: string
): string | null {
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
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    footerText: texts?.footerText ?? `© ${new Date().getFullYear()} RBDS`,
  };

  useEffect(() => {
    if (externalError && externalError.length > 0) {
      setError(externalError)
    }
  }, [externalError])

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
      } else {
        if (!!authUrl && !!clientId && !!redirectUri) {
          const redirectUrl = await startOAuthLogin({
            authUrl,
            clientId,
            redirectUri,
            username,
            password,
          });
          window.location.href = redirectUrl;
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível entrar. Tente novamente.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const rootClassName = ["rbds-login-root", className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName}>
      {/* Mobile top bar */}
      <div className="rbds-login-topbar" aria-hidden="true" />

      <div className="rbds-login-wrapper">
        {/* ── Side panel ── */}
        <div className="rbds-login-panel">
          <div className="rbds-login-panel-glow-top" aria-hidden="true" />
          <div className="rbds-login-panel-glow-bottom" aria-hidden="true" />

          <div className="rbds-login-panel-content">
            <div className="rbds-login-panel-body">
              <div className="rbds-login-panel-inner">
                <span className="rbds-login-badge">{t.badge}</span>

                <div>
                  <h1 className="rbds-login-panel-title">{t.title}</h1>
                  <p className="rbds-login-panel-subtitle">{t.subtitle}</p>
                </div>

                {highlights.length > 0 && (
                  <ul
                    className="rbds-login-highlights"
                    aria-label="Destaques do sistema"
                  >
                    {highlights.map((h, i) => (
                      <li key={i} className="rbds-login-highlight-item">
                        <span className="rbds-login-highlight-icon">
                          {h.icon ?? <LinkIcon />}
                        </span>
                        <div>
                          <p className="rbds-login-highlight-title">{h.title}</p>
                          <p className="rbds-login-highlight-text">{h.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <p className="rbds-login-panel-footer">{t.footerText}</p>
          </div>
        </div>

        {/* ── Form side ── */}
        <div className="rbds-login-form-side">
          <div className="rbds-login-card">
            <div className="rbds-login-card-header">
              {logo &&
                (typeof logo === "string" ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="rbds-login-card-logo"
                  />
                ) : (
                  <div className="rbds-login-card-logo">{logo}</div>
                ))}
              <h2 className="rbds-login-card-title">{t.cardTitle}</h2>
              <p className="rbds-login-card-desc">{t.cardDescription}</p>
            </div>

            <div className="rbds-login-card-body">
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
                <div className="rbds-login-field">
                  <label htmlFor="rbds-password" className="rbds-login-label">
                    {t.passwordLabel}
                  </label>
                  <div className="rbds-login-input-wrapper">
                    <input
                      id="rbds-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      required
                      disabled={isLoading}
                      className="rbds-login-input rbds-login-input--password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoading}
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      className="rbds-login-toggle-pw"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rbds-login-error" role="alert">
                    <AlertCircleIcon />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rbds-login-submit"
                >
                  {isLoading ? (
                    <>
                      <SpinnerIcon />
                      {t.loadingText}
                    </>
                  ) : (
                    t.submitText
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
