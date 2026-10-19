import React from "react";
import type { Highlight } from "../types";
import { LinkIcon } from "./icons";
import "../styles/auth.css";

export type AuthLayoutProps = {
  badge: string;
  title: string;
  subtitle: string;
  footerText: string;
  cardTitle: string;
  cardDescription: string;
  logo?: string | React.ReactNode;
  highlights: Highlight[];
  className?: string;
  children: React.ReactNode;
};

export function AuthLayout({
  badge,
  title,
  subtitle,
  footerText,
  cardTitle,
  cardDescription,
  logo,
  highlights,
  className,
  children,
}: AuthLayoutProps) {
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
                <span className="rbds-login-badge">{badge}</span>

                <div>
                  <h1 className="rbds-login-panel-title">{title}</h1>
                  <p className="rbds-login-panel-subtitle">{subtitle}</p>
                </div>

                {highlights.length > 0 && (
                  <ul className="rbds-login-highlights" aria-label="Destaques do sistema">
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

            <p className="rbds-login-panel-footer">{footerText}</p>
          </div>
        </div>

        {/* ── Form side ── */}
        <div className="rbds-login-form-side">
          <div className="rbds-login-card">
            <div className="rbds-login-card-header">
              {logo &&
                (typeof logo === "string" ? (
                  <img src={logo} alt="Logo" className="rbds-login-card-logo" />
                ) : (
                  <div className="rbds-login-card-logo">{logo}</div>
                ))}
              <h2 className="rbds-login-card-title">{cardTitle}</h2>
              <p className="rbds-login-card-desc">{cardDescription}</p>
            </div>

            <div className="rbds-login-card-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
