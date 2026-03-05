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

export const viewport = {
    themeColor: '#000000',
};

export const metadata: Metadata = {
    metadataBase: new URL('https://elissyan.vercel.app'),
    title: 'Elysian | AI Workflow Intelligence Platform',
    description: 'Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control into a unified execution layer.',
    authors: [{ name: 'Elysian' }],
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' }
        ],
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        type: 'website',
        url: 'https://elissyan.vercel.app/',
        title: 'Elysian | AI Workflow Intelligence Platform',
        description: 'Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control into a unified execution layer.',
        siteName: 'Elysian',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Elysian Dashboard Preview',
            },
        ],
        locale: 'en_US',
        alternateLocale: ['id_ID'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Elysian | AI Workflow Intelligence Platform',
        description: 'Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control into a unified execution layer.',
        images: ['/og-image.jpg'],
    },
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Elysian",
                            "url": "https://elissyan.vercel.app/",
                            "logo": "https://elissyan.vercel.app/logo.png"
                        })
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "Elysian",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web",
                            "description": "AI workflow intelligence platform for enterprise automation, centralizing operational visibility and decision control.",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Elysian"
                            }
                        })
                    }}
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
