import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState, useEffect } from 'react';
import { Toaster } from '../ui/Toaster';
import { CommandPalette } from '../CommandPalette';
import { KeyboardShortcutsHelp } from '../KeyboardShortcutsHelp';
import { WelcomeSurvey } from '../WelcomeSurvey';
import { OnboardingTour } from '../OnboardingTour';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useAuth } from '@/contexts/AuthContext';

export function Layout() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    const { profile } = useUserProfile();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showTour, setShowTour] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    // Check if user has completed onboarding on mount
    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasCompletedOnboarding) {
            // Small delay to ensure app loads smoothly before showing dialog
            const timer = setTimeout(() => setShowWelcome(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleWelcomeComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        setShowWelcome(false);
        // Start tour after welcome survey if onboarding is enabled
        if (profile.showOnboarding) {
            setTimeout(() => setShowTour(true), 800);
        }
    };

    const handleTourComplete = () => {
        localStorage.setItem('tour_completed', 'true');
        setShowTour(false);
    };

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

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    return (
        <>
            {/* Welcome Survey - shows on first visit */}
            <WelcomeSurvey
                open={showWelcome}
                onComplete={handleWelcomeComplete}
            />

            {/* Interactive Tour - shows after welcome survey */}
            <OnboardingTour
                show={showTour}
                onComplete={handleTourComplete}
            />

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
