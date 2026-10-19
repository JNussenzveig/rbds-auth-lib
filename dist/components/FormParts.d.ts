import React from "react";
export declare const ErrorAlert: ({ message }: {
    message: string;
}) => React.JSX.Element | null;
export declare const SuccessAlert: ({ title, message }: {
    title?: string;
    message: string;
}) => React.JSX.Element;
export declare const SubmitButton: ({ isLoading, text, loadingText, type, onClick, }: {
    isLoading: boolean;
    text: string;
    loadingText: string;
    type?: "submit" | "button";
    onClick?: () => void;
}) => React.JSX.Element;
export declare const BackLink: ({ text, href, onClick, }: {
    text: string;
    href?: string;
    onClick?: () => void;
}) => React.JSX.Element;
export declare const ForgotPasswordLink: ({ text, href, onClick, disabled, }: {
    text: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
}) => React.JSX.Element | null;
export declare const PasswordField: ({ id, label, value, onChange, placeholder, disabled, autoComplete, action, }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
    autoComplete?: string;
    action?: React.ReactNode;
}) => React.JSX.Element;
export declare function getErrorMessage(err: unknown, fallback: string): string;
//# sourceMappingURL=FormParts.d.ts.map