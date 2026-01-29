import { Bell, Search, HelpCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { useState } from 'react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const navigate = useNavigate();
    const [showShortcuts, setShowShortcuts] = useState(false);

    const handleSearchClick = () => {
        // Dispatch keyboard event to trigger command palette
        const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
        window.dispatchEvent(event);
    };

    return (
        <>
            {/* Keyboard Shortcuts Help Dialog */}
            <KeyboardShortcutsHelp
                open={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />

            <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Bar with K key hint */}
                    <div data-tour="search" className="relative flex-1 md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search... (Press K)"
                            className="h-9 w-64 rounded-md border border-input bg-transparent px-9 pr-12 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                            readOnly
                            onClick={handleSearchClick}
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-muted rounded text-xs font-mono border border-border pointer-events-none">
                            K
                        </kbd>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/evaluations/new')}
                        className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Run New Eval
                    </button>

                    {/* Keyboard Shortcuts Button */}
                    <button
                        onClick={() => setShowShortcuts(true)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Keyboard shortcuts (?)"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    <button className="text-muted-foreground hover:text-foreground transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                    </button>
                </div>
            </header>
        </>
    );
}
