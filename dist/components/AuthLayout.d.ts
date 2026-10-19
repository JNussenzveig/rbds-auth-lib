import React from "react";
import type { Highlight } from "../types";
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
export declare function AuthLayout({ badge, title, subtitle, footerText, cardTitle, cardDescription, logo, highlights, className, children, }: AuthLayoutProps): React.JSX.Element;
//# sourceMappingURL=AuthLayout.d.ts.map