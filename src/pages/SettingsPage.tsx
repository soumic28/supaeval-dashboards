

import { Button } from '@/components/ui/Button';
import { User, Lock, Bell, CreditCard } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and workspace settings.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 space-y-1">
                    {[
                        { name: 'General', icon: User, active: true },
                        { name: 'Security', icon: Lock, active: false },
                        { name: 'Notifications', icon: Bell, active: false },
                        { name: 'Billing', icon: CreditCard, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${item.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </button>
                    ))}
                </aside>

                <div className="flex-1 space-y-6">
                    <div className="border rounded-lg p-6 bg-card space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Profile Information</h3>
                            <p className="text-sm text-muted-foreground">Update your account's profile information and email address.</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Name</label>
                                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="John Doe" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email</label>
                                <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="john@example.com" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 bg-card space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Appearance</h3>
                            <p className="text-sm text-muted-foreground">Customize the look and feel of the dashboard.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-20 w-32 rounded-md bg-background border-2 border-primary ring-2 ring-primary/20 cursor-pointer flex items-center justify-center font-medium">Light</div>
                            <div className="h-20 w-32 rounded-md bg-slate-950 border border-border cursor-pointer flex items-center justify-center font-medium text-white">Dark</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
