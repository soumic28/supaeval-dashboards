
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    Settings,
    Play,
    BarChart2,
    MessageSquare,
    Code2,
    Box
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { name: 'Home', icon: LayoutDashboard, path: '/' },
    { name: 'Datasets', icon: Database, path: '/datasets' },
    { name: 'Configurations', icon: Settings, path: '/configs' },
    { name: 'Evaluations', icon: Play, path: '/evaluations' },
    { name: 'Dashboards', icon: BarChart2, path: '/dashboards' },
    { name: 'RLHF', icon: MessageSquare, path: '/rlhf' },
    { name: 'SDK & API', icon: Code2, path: '/sdk' },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={cn(
                "h-screen w-64 border-r border-border bg-card text-card-foreground flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center gap-2 border-b border-border/50">
                    <Box className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold tracking-tight">SupaEval</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()} // Close sidebar on navigation on mobile
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border/50">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            JD
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">John Doe</span>
                            <span className="text-xs text-muted-foreground">Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
