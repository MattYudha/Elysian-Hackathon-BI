'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Only initialize Lenis on desktop/tablet to ensure native mobile performance
        if (typeof window !== 'undefined' && window.innerWidth > 768) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            });

            function raf(time: number) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            return () => {
                lenis.destroy();
            };
        }
    }, []);

    return <>{children}</>;
}
