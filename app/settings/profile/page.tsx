'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import Link from 'next/link';
import { ChevronLeft, User, Smartphone, Save, Shield } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '@/lib/schemas/profile';
import { useSettingsUiStore } from '@/store/ui/settingsStore';

// Mock User Data Interface
interface UserProfile {
    name: string;
    email: string;
    avatar: string | null;
    phone: string;
    bio?: string;
}

export default function ProfilePage() {
    const { profile, updateProfile } = useUserStore();
    const [hasHydrated, setHasHydrated] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: profile?.name?.split(' ')[0] || 'Alex',
            lastName: profile?.name?.split(' ').slice(1).join(' ') || 'Morgan',
            jobTitle: 'Product Manager', // Mock
            phone: profile?.phone || '',
            bio: profile?.bio || '',
            avatar: profile?.avatar || null,
            links: []
        }
    });

    const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = form;
    const currentAvatar = watch('avatar');
    const { setFormDirty } = useSettingsUiStore();

    // Hydration Fix: Wait for client-side load
    useEffect(() => {
        useUserStore.persist.rehydrate();
        setHasHydrated(true);
        if (profile) {
            form.reset({
                firstName: profile?.name?.split(' ')[0] || 'Alex',
                lastName: profile?.name?.split(' ').slice(1).join(' ') || 'Morgan',
                jobTitle: 'Product Manager',
                phone: profile?.phone || '',
                bio: profile?.bio || '',
                avatar: profile?.avatar || null,
                links: []
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    // Sync form dirty state with Zustand
    useEffect(() => {
        setFormDirty(isDirty);
        return () => setFormDirty(false);
    }, [isDirty, setFormDirty]);

    if (!hasHydrated) return <div className="p-8 text-center text-slate-500">Loading profile settings...</div>;

    const onSubmit = (data: ProfileFormValues) => {
        const updatedUser: UserProfile = {
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: profile?.email || 'alex@elysian.app',
            avatar: data.avatar || null,
            phone: data.phone || '',
            bio: data.bio || ''
        };
        updateProfile(updatedUser);
        form.reset(data); // Resets isDirty state
        toast.success("Profil berhasil diperbarui", {
            description: "Data Anda telah tersimpan di sistem lokal.",
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File terlalu besar (Max 5MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setValue('avatar', base64String, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:mx-0">

            {/* Header (Back Button handled globally in layout) */}

            <div className="flex flex-col gap-8">

                {/* Main Content: The Form */}
                <div className="flex-1 min-w-0 space-y-8 max-w-2xl">
                    {/* Intro */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
                        <p className="text-sm text-slate-500 mt-1">Update your personal details that will be displayed on your public profile.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-transparent p-0">
                        {/* Compact Avatar Row for Layout Efficiency */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                            <Avatar className="h-20 w-20 border border-slate-200 dark:border-slate-700">
                                <AvatarImage src={currentAvatar || ''} className="object-cover" />
                                <AvatarFallback className="text-xl bg-slate-100 dark:bg-slate-800">
                                    {form.getValues('firstName')?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                    >
                                        Upload New
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => setValue('avatar', null, { shouldDirty: true })}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400">Recommended: Square JPG, PNG. Max 1MB.</p>
                                <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 max-w-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                                    <Input
                                        id="firstName"
                                        {...register('firstName')}
                                        className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                                    />
                                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                                    <p className="text-[13px] text-slate-500">This is your public display name.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        {...register('lastName')}
                                        className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                                    />
                                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled
                                    value={profile?.email || 'alex@elysian.app'}
                                    className="h-10 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md text-slate-500"
                                />
                                <p className="text-[13px] text-slate-500">Your email address cannot be changed from the profile page.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                                <textarea
                                    id="bio"
                                    {...register('bio')}
                                    className="w-full min-h-[120px] p-3 text-sm bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                                    placeholder="Tell us a little bit about yourself"
                                />
                                {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
                                <p className="text-[13px] text-slate-500">You can @mention other users and organizations to link to them.</p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Add Links</h3>
                                    <p className="text-[13px] text-slate-500">Add links to your website, blog, or social media profiles.</p>
                                </div>
                                <div className="space-y-3">
                                    <Input
                                        placeholder="https://elysian.app"
                                        className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md"
                                    />
                                    <Input
                                        placeholder="http://twitter.com/yourusername"
                                        className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="mt-2 h-9 text-xs">
                                    Add Link
                                </Button>
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-md shadow-blue-500/20 rounded-md px-6"
                                >
                                    Update profile
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    );
}
