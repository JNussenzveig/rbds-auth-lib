import type React from "react";
export interface Jwt {
    user_id: number;
    is_admin: boolean;
    roles: string[];
    scopes: string[];
    exp: number;
    jti: string;
    display_name: string;
    email: string;
}
export type LoginCredentials = {
    username: string;
    password: string;
};
export type LogoutResult = {
    success: true;
} | {
    success: false;
    error: string;
};
export type StartOAuthLoginOptions = {
    authUrl: string;
    responseType?: string;
    clientId: string;
    redirectUri: string;
    username: string;
    password: string;
};
export type PKCEResult = {
    verifier: string;
    challenge: string;
};
export type OAuthTokenOptions = {
    authUrl: string;
    grantType?: string;
    clientId: string;
    code: string;
    redirectUri: string;
    codeVerifier?: string;
};
export type RefreshTokenOptions = {
    authUrl: string;
    clientId: string;
    refreshToken: string;
};
export type OAuthTokenResult = {
    success: true;
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
} | {
    success: false;
    error: string;
};
export type Highlight = {
    icon?: React.ReactNode;
    title: string;
    text: string;
};
type BaseScreenProps = {
    logo?: string | React.ReactNode;
    highlights?: Highlight[];
    className?: string;
    externalError?: string;
    loginHref?: string;
    onBackToLogin?: () => void;
};
export type LoginScreenTexts = {
    badge?: string;
    title?: string;
    subtitle?: string;
    cardTitle?: string;
    cardDescription?: string;
    usernameLabel?: string;
    usernamePlaceholder?: string;
    passwordLabel?: string;
    passwordPlaceholder?: string;
    submitText?: string;
    loadingText?: string;
    footerText?: string;
    forgotPasswordText?: string;
};
export type LoginScreenProps = {
    onSubmit?: (credentials: LoginCredentials) => Promise<void>;
    logo?: string | React.ReactNode;
    texts?: LoginScreenTexts;
    highlights?: Highlight[];
    className?: string;
    authUrl?: string;
    clientId?: string;
    redirectUri?: string;
    externalError?: string;
    forgotPasswordHref?: string;
    onForgotPassword?: () => void;
};
export type PasswordResetResult = {
    success: true;
} | {
    success: false;
    error: string;
};
export type SendResetCodeOptions = {
    baseUrl?: string;
    email: string;
    redirectUri?: string;
};
export type ValidateResetCodeOptions = {
    baseUrl?: string;
    code: string;
};
export type ResetPasswordOptions = {
    baseUrl?: string;
    code: string;
    password: string;
    confirm: string;
    redirectUri?: string;
};
export type ForgotPasswordScreenTexts = {
    badge?: string;
    title?: string;
    subtitle?: string;
    cardTitle?: string;
    cardDescription?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    submitText?: string;
    loadingText?: string;
    successTitle?: string;
    successMessage?: string;
    resendText?: string;
    backToLoginText?: string;
    footerText?: string;
};
export type ForgotPasswordScreenProps = BaseScreenProps & {
    baseUrl?: string;
    redirectUri?: string;
    texts?: ForgotPasswordScreenTexts;
    onSubmit?: (email: string) => Promise<void> | void;
    onSuccess?: (email: string) => void;
};
export type ResetPasswordScreenTexts = {
    badge?: string;
    title?: string;
    subtitle?: string;
    footerText?: string;
    codeCardTitle?: string;
    codeCardDescription?: string;
    codeLabel?: string;
    codePlaceholder?: string;
    verifyText?: string;
    verifyingText?: string;
    passwordCardTitle?: string;
    passwordCardDescription?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    passwordPlaceholder?: string;
    submitText?: string;
    loadingText?: string;
    successCardTitle?: string;
    successCardDescription?: string;
    successMessage?: string;
    goToLoginText?: string;
    backToLoginText?: string;
};
export type ResetPasswordScreenProps = BaseScreenProps & {
    codeUrl?: string;
    resetUrl?: string;
    texts?: ResetPasswordScreenTexts;
    codeParam?: string;
    initialCode?: string;
    redirectUri?: string;
    minPasswordLength?: number;
    onVerifyCode?: (code: string) => Promise<void> | void;
    onResetPassword?: (data: {
        code: string;
        password: string;
        confirm: string;
    }) => Promise<void> | void;
    onSuccess?: () => void;
};
export {};
//# sourceMappingURL=index.d.ts.map