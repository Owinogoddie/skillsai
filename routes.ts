/**
 * An array of routes accessible to the public
 *These routes do not require authentication
 *@types {string[]}
 */

 export const publicRoutes=[
    "/"
 ]
/**
 * An array of routes used for authentication
 *These routes will redirect users to /settings
 *@types {string[]}
 */

 
 export const authRoutes=[
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/new-verification",
    "/auth/reset-password",
    "/auth/new-password"
 ]
/**
 * The prefix for API authentication routes
 *Routes that start with this prefix are used for API
 *@types {string}
 */

 export const apiAuthPrefix="/api/auth"
/**
 * The default redirect after logging in
 *@types {string}
 */

 export const DEFAULT_LOGIN_REDIRECT="/"