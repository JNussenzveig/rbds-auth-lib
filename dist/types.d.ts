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
};
export type Highlight = {
    icon?: React.ReactNode;
    title: string;
    text: string;
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
};
//# sourceMappingURL=types.d.ts.map