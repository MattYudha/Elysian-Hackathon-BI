import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Teruskan request ke Backend (Railway)
        const response = await fetch(`${config.api.baseURL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Backend berhasil login, dapatkan refresh_token
        // Ambil Header Set-Cookie dari response backend
        const setCookieHeader = response.headers.get('set-cookie');

        // Buat response untuk Frontend
        const nextResponse = NextResponse.json(data, { status: 200 });

        // Parsing cookie untuk di-set di doman Vercel (Next.js)
        if (setCookieHeader) {
            // Kita extract token secara manual dari `refresh_token=...;`
            const match = setCookieHeader.match(/refresh_token=([^;]+)/);
            if (match && match[1]) {
                const token = match[1];

                // Set the exact same cookie manually via Next.js
                // So the browser attaches it to Vercel domain requests
                // layout.tsx will look for this cookie on SSR.
                nextResponse.cookies.set({
                    name: 'refresh_token',
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 // 7 days
                });
            } else {
                // Fallback: Just pass the original header over if parsing fails
                nextResponse.headers.append('Set-Cookie', setCookieHeader);
            }
        } else if (data.data?.refresh_token) {
            nextResponse.cookies.set({
                name: 'refresh_token',
                value: data.data.refresh_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
        }

        return nextResponse;
    } catch (error: any) {
        console.error('BFF Login Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
