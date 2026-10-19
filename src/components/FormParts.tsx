import React, { useState } from "react";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  SpinnerIcon,
} from "./icons";

export const ErrorAlert = ({ message }: { message: string }) =>
  message ? (
    <div className="rbds-login-error" role="alert">
      <AlertCircleIcon />
      <span>{message}</span>
    </div>
  ) : null;

export const SuccessAlert = ({ title, message }: { title?: string; message: string }) => (
  <div className="rbds-login-success" role="status">
    <CheckCircleIcon />
    <div>
      {title && <p className="rbds-login-success-title">{title}</p>}
      <p>{message}</p>
    </div>
  </div>
);

export const SubmitButton = ({
  isLoading,
  text,
  loadingText,
  type = "submit",
  onClick,
}: {
  isLoading: boolean;
  text: string;
  loadingText: string;
  type?: "submit" | "button";
  onClick?: () => void;
}) => (
  <button type={type} onClick={onClick} disabled={isLoading} className="rbds-login-submit">
    {isLoading ? (
      <>
        <SpinnerIcon />
        {loadingText}
      </>
    ) : (
      text
    )}
  </button>
);

export const BackLink = ({
  text,
  href,
  onClick,
}: {
  text: string;
  href?: string;
  onClick?: () => void;
}) => {
  const content = (
    <>
      <ArrowLeftIcon />
      {text}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="rbds-login-back">
        {content}
      </button>
    );
  }

  const targetHref = href || "/";

  return (
    <a
      href={targetHref}
      onClick={(e) => {
        if (!href && typeof window !== "undefined" && window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      }}
      className="rbds-login-back"
    >
      {content}
    </a>
  );
};

export const ForgotPasswordLink = ({
  text,
  href,
  onClick,
  disabled,
}: {
  text: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  if (!href && !onClick) return null;

  if (onClick && !href) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rbds-login-forgot"
      >
        {text}
      </button>
    );
  }

  return (
    <a
      href={href ?? "#"}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`rbds-login-forgot ${disabled ? "is-disabled" : ""}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
    >
      {text}
    </a>
  );
};

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete = "new-password",
  action,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  action?: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="rbds-login-field">
      <div className="rbds-login-label-row">
        <label htmlFor={id} className="rbds-login-label">
          {label}
        </label>
        {action}
      </div>
      <div className="rbds-login-input-wrapper">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          disabled={disabled}
          className="rbds-login-input rbds-login-input--password"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          disabled={disabled}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="rbds-login-toggle-pw"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
