import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Database,
    Settings,
    Play,
    BarChart2,
    Code2,
    ChevronDown,
    ChevronRight,
    Users,
    Bot,
    RefreshCw,
    LineChart,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { WorkspaceSelector } from '@/components/workspaces/WorkspaceSelector';

interface NavItem {
    name: string;
    icon?: any;
    path?: string;
    children?: { name: string; path: string }[];
}

const navItems: NavItem[] = [
    { name: 'Home', icon: LayoutDashboard, path: '/' },
    {
        name: 'Datasets',
        icon: Database,
        children: [
            { name: 'My Datasets', path: '/datasets/my-datasets' },
            { name: 'Marketplace', path: '/datasets/marketplace' },
            { name: 'Synthetic Data', path: '/datasets/synthetic-data' },
        ]
    },
    {
        name: 'Evaluations',
        icon: Play,
        children: [
            { name: 'All Runs', path: '/evaluations/runs' },
            { name: 'Traces', path: '/evaluations/traces' },
            { name: 'Scheduled', path: '/evaluations/scheduled' },
            { name: 'Prompt Playground', path: '/evaluations/prompt-playground' },
        ]
    },
    {
        name: 'Configurations',
        icon: Settings,
        children: [
            { name: 'Agent Config', path: '/configurations/agents' },
            { name: 'Metrics Config', path: '/configurations/metrics' },
        ]
    },
    {
        name: 'Benchmarks',
        icon: LineChart,
        children: [
            // { name: 'Suites', path: '/benchmarks/suites' },
            { name: 'Comparisons', path: '/benchmarks/comparisons' },
            { name: 'Regression', path: '/benchmarks/regression' },
        ]
    },
    {
        name: 'Resource Management',
        icon: Database,
        children: [
            { name: 'Cost Analysis', path: '/resource/cost' },
            { name: 'Pricing Tier', path: '/resource/pricing' },
            { name: 'Usage management', path: '/resource/usage' },
        ]
    },
    { name: 'Metrics', icon: BarChart2, path: '/metrics' },
    {
        name: 'Agents',
        icon: Bot,
        children: [
            { name: 'Connected Agents', path: '/agents/connected' },
            { name: 'Endpoints', path: '/agents/endpoints' },
        ]
    },
    { name: 'RLHF', icon: RefreshCw, path: '/rlhf' },
    { name: 'SDK & API', icon: Code2, path: '/sdk' },
];

const bottomNavItems: NavItem[] = [
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Team', icon: Users, path: '/team' },
];

export function Sidebar({
    isOpen,
    onClose,
    isCollapsed = false,
    onToggleCollapse
}: {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}) {
    const { logout } = useAuth();
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        'Datasets': true,
        'Evaluations': true,
        'Configurations': true,
        'Benchmarks': true,
        'Agents': true
    });

    const toggleSection = (name: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const NavItemComponent = ({ item }: { item: NavItem }) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedSections[item.name];

        // Check if any child is active
        const isChildActive = item.children?.some(child => location.pathname === child.path);

        if (hasChildren) {
            return (
                <div className="space-y-1">
                    <button
                        onClick={() => {
                            if (isCollapsed && onToggleCollapse) {
                                onToggleCollapse();
                            }
                            toggleSection(item.name);
                        }}
                        title={isCollapsed ? item.name : undefined}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isCollapsed && "justify-center px-0",
                            isChildActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <div className={cn("flex items-center gap-3", isCollapsed && "gap-0 justify-center")}>
                            {item.icon && <item.icon className="w-4 h-4" />}
                            {!isCollapsed && <span>{item.name}</span>}
                        </div>
                        {!isCollapsed && (
                            isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )
                        )}
                    </button>

                    {(!isCollapsed && isExpanded) && (
                        <div className="pl-9 space-y-1">
                            {item.children!.map((child) => (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    onClick={() => onClose()}
                                    className={({ isActive }) =>
                                        cn(
                                            "block px-3 py-1.5 text-sm transition-colors rounded-md",
                                            isActive
                                                ? "text-primary font-medium"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )
                                    }
                                >
                                    {child.name}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <NavLink
                to={item.path!}
                onClick={() => onClose()}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                    cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isCollapsed ? "justify-center px-0 gap-0" : "gap-3",
                        isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )
                }
            >
                {item.icon && <item.icon className="w-4 h-4" />}
                {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div
                data-tour="sidebar"
                className={cn(
                    "h-screen border-r border-border bg-card text-card-foreground flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out md:translate-x-0 group",
                    isCollapsed ? "w-20" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>

                <div className="p-2 border-b border-border/50 relative">
                    <WorkspaceSelector isCollapsed={isCollapsed} />
                    {onToggleCollapse && (
                        <button
                            onClick={onToggleCollapse}
                            className="hidden md:flex absolute top-4 right-[-12px] h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted text-muted-foreground z-50 transition-colors"
                        >
                            {isCollapsed ? <PanelLeftOpen className="h-3 w-3 relative right-[1px]" /> : <PanelLeftClose className="h-3 w-3 relative right-[1px]" />}
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => (
                        <NavItemComponent key={item.name} item={item} />
                    ))}
                </nav>

                <div className="p-3 border-t border-border/50 space-y-1">
                    {bottomNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path!}
                            onClick={() => onClose()}
                            title={isCollapsed ? item.name : undefined}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isCollapsed ? "justify-center px-0 gap-0" : "gap-3",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )
                            }
                        >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            {!isCollapsed && <span>{item.name}</span>}
                        </NavLink>
                    ))}
                    <button
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                        title={isCollapsed ? "Logout" : undefined}
                        className={cn(
                            "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors",
                            isCollapsed ? "justify-center px-0 gap-0" : "gap-3"
                        )}
                    >
                        <LogOut className="w-4 h-4" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
