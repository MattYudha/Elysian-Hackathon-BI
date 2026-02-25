/**
 * middleware.ts — Next.js Edge Middleware
 *
 * Runs before every request. Ensures tenant_id cookie is set
 * so Server Components can read tenant identity during SSR.
 *
 * Flow:
 * 1. Check for tenant_id cookie
 * 2. If missing, set default tenant cookie
 * 3. Cookie is available to Server Components via cookies() from next/headers
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_TENANT_ID = 'tenant-1';
const TENANT_COOKIE = 'tenant_id';

export function middleware(request: NextRequest) {
    const tenantId = request.cookies.get(TENANT_COOKIE)?.value;

    // If no tenant cookie exists, set the default
    if (!tenantId) {
        const response = NextResponse.next();
        response.cookies.set(TENANT_COOKIE, DEFAULT_TENANT_ID, {
            path: '/',
            httpOnly: false, // Client JS needs to read this for switchTenant()
            sameSite: 'lax',
            // secure: true in production (handled by Next.js in HTTPS)
            maxAge: 60 * 60 * 24 * 7, // 1 year
        });
        return response;
    }

    return NextResponse.next();
}

// Only run middleware on app routes, not static files or API
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|api/).*)',
    ],
};
