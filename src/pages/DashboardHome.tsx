
import { useState } from 'react';
import { CommandPalette } from '@/components/CommandPalette';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { Essentials } from '@/components/dashboard/Essentials';

import { GetStarted } from '@/components/dashboard/GetStarted';
import { AgentsActionableInsights } from '@/components/dashboard/AgentsActionableInsights';
import { QuickNavigations } from '@/components/dashboard/QuickNavigations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function DashboardHome() {
    const [showCommandPalette, setShowCommandPalette] = useState(false);

    useKeyboardShortcut([
        {
            key: 'k',
            description: 'Global search',
            callback: () => {
                setShowCommandPalette(true);
            }
        },
    ]);

    return (
        <>
            <CommandPalette
                open={showCommandPalette}
                onClose={() => setShowCommandPalette(false)}
            />

            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header & Essentials (Always Present) */}
                <div className="space-y-6">


                    <Essentials />
                </div>

                {/* Tabbed Content */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-8 space-x-8">
                        <TabsTrigger
                            value="overview"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-1 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="get-started"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-1 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Get Started
                        </TabsTrigger>
                        <TabsTrigger
                            value="develop"
                            className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-1 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Develop
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-12 outline-none">
                        <AgentsActionableInsights />
                        <QuickNavigations />
                    </TabsContent>

                    <TabsContent value="get-started" className="outline-none">
                        <GetStarted />
                    </TabsContent>

                    <TabsContent value="develop" className="outline-none min-h-[400px]">
                        <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-muted">
                            <p>Development tools and API configuration coming soon.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
