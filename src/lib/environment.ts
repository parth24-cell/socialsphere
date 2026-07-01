export function isDevelopmentMode(): boolean {
  return process.env.DEVELOPMENT_MODE === "true";
}

export function isEmailVerificationSkipped(): boolean {
  return process.env.AUTH_SKIP_EMAIL_VERIFICATION === "true";
}
