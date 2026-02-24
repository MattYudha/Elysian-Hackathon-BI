import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config';
import { GhostModeIndicator } from '@/components/admin/GhostModeIndicator';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: APP_NAME,
    description: APP_DESCRIPTION,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://api.fontshare.com" />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
                <NuqsAdapter>
                    <Providers>
                        <GhostModeIndicator />
                        {children}
                    </Providers>
                </NuqsAdapter>
            </body>
        </html>
    );
}
