
import { Bell, Search, HelpCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                >
                    <Menu className="w-5 h-5" />
                </button>
                {/* Breadcrumbs or Page Title could go here */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/evaluations/run-details')}
                    className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Run New Eval
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
                </button>
            </div>
        </header>
    );
}
