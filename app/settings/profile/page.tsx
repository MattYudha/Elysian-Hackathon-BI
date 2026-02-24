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
    const [formData, setFormData] = useState<UserProfile>({
        name: profile?.name || 'Alex Morgan',
        email: profile?.email || 'alex@elysian.app',
        avatar: profile?.avatar || null,
        phone: profile?.phone || '+1 (555) 000-0000',
        bio: profile?.bio || 'Passionate about building great user experiences and scalable software solutions.',
    });
    const [hasHydrated, setHasHydrated] = useState(false);

    // Hydration Fix: Wait for client-side load
    useEffect(() => {
        useUserStore.persist.rehydrate();
        setHasHydrated(true);
        setFormData({
            name: profile?.name || 'Alex Morgan',
            email: profile?.email || 'alex@elysian.app',
            avatar: profile?.avatar || null,
            phone: profile?.phone || '+1 (555) 000-0000',
            bio: profile?.bio || 'Passionate about building great user experiences and scalable software solutions.',
        }); // Sync initial
    }, [profile]);

    if (!hasHydrated) return <div className="p-8 text-center text-slate-500">Loading profile settings...</div>;

    const handleSave = () => {
        updateProfile(formData);
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
                setFormData(prev => ({ ...prev, avatar: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:mx-0">

            {/* Header (Back Button handled globally in layout) */}

            {/* 3-Column Layout: [Sidebar (handled by layout)] [Main Content] [Context Panel] */}
            <div className="flex flex-col-reverse lg:flex-row gap-8">

                {/* Main Content: The Form */}
                <div className="flex-1 min-w-0 space-y-8">
                    {/* Intro */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
                        <p className="text-sm text-slate-500 mt-1">Update your personal details that will be displayed on your public profile.</p>
                    </div>

                    <div className="bg-white dark:bg-[#0B1120]/60 p-0 md:p-8 md:border md:border-slate-200 md:dark:border-blue-900/30 md:rounded-2xl md:shadow-sm glass-obsidian">
                        {/* Compact Avatar Row for Layout Efficiency */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-blue-900/30">
                            <Avatar className="h-20 w-20 border-2 border-slate-100 dark:border-slate-700">
                                <AvatarImage src={formData.avatar || ''} className="object-cover" />
                                <AvatarFallback className="text-xl bg-slate-100 dark:bg-slate-800">{formData.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                    >
                                        Upload New
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 rounded-full"
                                        onClick={() => setFormData(prev => ({ ...prev, avatar: null }))}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs text-slate-500 font-semibold uppercase">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.name.split(' ')[0] || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: `${e.target.value} ${prev.name.split(' ').slice(1).join(' ')}` }))}
                                        className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg focus-visible:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs text-slate-500 font-semibold uppercase">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.name.split(' ').slice(1).join(' ') || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: `${prev.name.split(' ')[0]} ${e.target.value}` }))}
                                        className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jobTitle" className="text-xs text-slate-500 font-semibold uppercase">Job Title</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="jobTitle"
                                        defaultValue="Product Manager"
                                        className="h-10 pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs text-slate-500 font-semibold uppercase">Phone Number</Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="h-10 pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-xs text-slate-500 font-semibold uppercase">Bio</Label>
                                <textarea
                                    id="bio"
                                    className="w-full min-h-[120px] p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-blue-900/50 rounded-lg focus-visible:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-[#0B1120] resize-y"
                                    placeholder="Tell us about yourself..."
                                    defaultValue="Passionate about building great user experiences..."
                                />
                                <p className="text-[10px] text-slate-400 text-right">0/500 characters</p>
                            </div>

                            <div className="pt-4">
                                <Button onClick={handleSave} className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Context Panel: Public Profile Preview */}
                <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
                    <div className="sticky top-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" />
                                Live Preview
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">This is how your profile looks to others.</p>
                        </div>

                        {/* Static Professional Card */}
                        <div className="border border-slate-200 dark:border-blue-900/30 rounded-[1.5rem] p-1 bg-white dark:bg-[#0B1120]/60 shadow-sm glass-obsidian">
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[1.3rem] p-6 text-center h-full relative overflow-hidden">
                                {/* Decor - Static & Subtle */}
                                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-100/50 to-transparent dark:from-blue-900/20 pointer-events-none" />

                                <div className="relative">
                                    <div className="mx-auto w-24 h-24 rounded-full p-1 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-blue-900/50 mb-4 shadow-sm">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={formData.avatar || ''} className="object-cover" />
                                            <AvatarFallback className="bg-slate-100 text-2xl">{formData.name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name || 'Your Name'}</h3>
                                    <p className="text-sm text-blue-600 font-medium mb-4">Product Manager</p>

                                    <div className="max-w-[200px] mx-auto">
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 italic">
                                            &quot;{formData.bio || 'No bio yet...'}&quot;
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-blue-900/30">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Completion</h4>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-green-500 rounded-full" />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">85%</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Add a profile cover to reach 100%</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
