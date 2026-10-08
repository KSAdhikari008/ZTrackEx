export const COOKIE_NAME = "TrackEx_token";

// used in logout since maxAge will set the age again when cookie is cleared.
export const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

// used in login and register.
export const authCookieOptions = {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7
}