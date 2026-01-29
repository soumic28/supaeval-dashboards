import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState } from 'react';
import { Toaster } from '../ui/Toaster';
import { CommandPalette } from '../CommandPalette';
import { KeyboardShortcutsHelp } from '../KeyboardShortcutsHelp';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export function Layout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

    // Global keyboard shortcuts - work on every page!
    useKeyboardShortcut([
        {
            key: 'k',
            description: 'Global search',
            callback: () => {
                console.log('K pressed - opening command palette');
                setShowCommandPalette(true);
            }
        },
        {
            key: 'n',
            description: 'New evaluation',
            callback: () => {
                console.log('N pressed - navigating to new evaluation');
                navigate('/evaluations/runs');
            }
        },
        {
            key: 'r',
            description: 'Refresh page',
            callback: () => {
                console.log('R pressed - refreshing page');
                window.location.reload();
            }
        },
        {
            key: '?',
            shiftKey: true,
            description: 'Show keyboard shortcuts',
            callback: () => {
                console.log('? pressed - showing shortcuts help');
                setShowShortcutsHelp(true);
            }
        },
    ]);

    return (
        <>
            {/* Global Command Palette - accessible from any page with K key */}
            <CommandPalette
                open={showCommandPalette}
                onClose={() => setShowCommandPalette(false)}
            />

            {/* Global Keyboard Shortcuts Help - accessible from any page with ? key */}
            <KeyboardShortcutsHelp
                open={showShortcutsHelp}
                onClose={() => setShowShortcutsHelp(false)}
            />

            <div className="min-h-screen bg-background font-sans antialiased flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'md:ml-64'} ml-0`}>
                    <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                        <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                            <Outlet />
                        </div>
                    </main>
                </div>
                <Toaster />
            </div>
        </>
    );
}
