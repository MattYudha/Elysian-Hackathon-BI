'use client';

import { useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/lib/sdk/schemas/auth.schema';

interface StoreInitializerProps {
    user: Pick<User, 'name' | 'email' | 'avatar'>;
}

/**
 * StoreInitializer is strictly a vessel intended to catch user data 
 * fetched by a Server Component (SSR) and immediately inject it into 
 * the singleton Zustand memory store during the initial Client Component mount.
 * 
 * This obliterates the Client-Side Waterfall by rendering the UI fully authenticated on Frame 1.
 */
export function StoreInitializer({ user }: StoreInitializerProps) {
    const initialized = useRef(false);

    if (!initialized.current) {
        // Sync injection into Zustand state BEFORE React finishes the initial render cycle
        useAuthStore.getState().login(user);
        // Turn off loading flag immediately because SSR already did the work
        useAuthStore.getState().setLoadingSession(false);
        initialized.current = true;
    }

    // It renders nothing. It strictly operates on memory.
    return null;
}
