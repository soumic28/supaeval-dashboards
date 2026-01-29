import { Search, ArrowRight, Clock, Database, BarChart2, Settings, Play, Hash, FileText, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    category: 'page' | 'evaluation' | 'dataset' | 'metric' | 'recent';
    icon: typeof Search;
    path: string;
}

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // All searchable items
    const allItems: SearchResult[] = [
        // Pages
        { id: 'dashboard', title: 'Dashboard', description: 'Overview and stats', category: 'page', icon: BarChart2, path: '/' },
        { id: 'evaluations', title: 'All Evaluations', description: 'View all evaluation runs', category: 'page', icon: Play, path: '/evaluations/runs' },
        { id: 'datasets', title: 'My Datasets', description: 'Manage datasets', category: 'page', icon: Database, path: '/datasets/my-datasets' },
        { id: 'marketplace', title: 'Dataset Marketplace', description: 'Browse datasets', category: 'page', icon: Database, path: '/datasets/marketplace' },
        { id: 'synthetic', title: 'Synthetic Data', description: 'Generate test data', category: 'page', icon: Database, path: '/datasets/synthetic-data' },
        { id: 'configs', title: 'Configurations', description: 'Agent & metric configs', category: 'page', icon: Settings, path: '/configurations/agents' },
        { id: 'benchmarks', title: 'Benchmarks', description: 'Benchmark suites', category: 'page', icon: Hash, path: '/benchmarks/suites' },
        { id: 'rlhf', title: 'RLHF', description: 'Human feedback', category: 'page', icon: FileText, path: '/rlhf' },
        { id: 'sdk', title: 'SDK & API', description: 'Documentation', category: 'page', icon: FileText, path: '/sdk' },
        { id: 'settings', title: 'Settings', description: 'App settings', category: 'page', icon: Settings, path: '/settings' },

        // Recent evaluations (mock data)
        { id: 'eval-1', title: 'Customer Support Bot v2', description: 'Score: 92%', category: 'recent', icon: Clock, path: '/evaluations/run-details?id=1023' },
        { id: 'eval-2', title: 'RAG Pipeline Alpha', description: 'Score: 45%', category: 'recent', icon: Clock, path: '/evaluations/run-details?id=1022' },
        { id: 'eval-3', title: 'Sales Agent', description: 'Score: 88%', category: 'recent', icon: Clock, path: '/evaluations/run-details?id=1021' },
    ];

    // Filter results based on query
    const results = query.trim() === ''
        ? allItems.filter(item => item.category === 'page').slice(0, 8)
        : allItems.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase())
        );

    // Focus input when dialog opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [open]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    navigate(results[selectedIndex].path);
                    onClose();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, results, selectedIndex, navigate, onClose]);

    const handleSelect = (item: SearchResult) => {
        navigate(item.path);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border border-border overflow-hidden"
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search pages, evaluations, datasets..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                    />
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto py-2">
                    {results.length === 0 ? (
                        <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {results.map((item, index) => {
                                const isSelected = index === selectedIndex;

                                return (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full flex items-center gap-4 px-4 py-3 transition-colors ${isSelected
                                            ? 'bg-accent'
                                            : 'hover:bg-accent/50'
                                            }`}
                                    >
                                        <div className={`p-2.5 rounded-lg transition-colors ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted'
                                            }`}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="text-sm font-medium truncate">{item.title}</div>
                                            {item.description && (
                                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer Hints */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <kbd className="px-2 py-1 bg-background rounded border border-border font-mono">↑↓</kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1.5">
                            <kbd className="px-2 py-1 bg-background rounded border border-border font-mono">↵</kbd>
                            Select
                        </span>
                        <span className="flex items-center gap-1.5">
                            <kbd className="px-2 py-1 bg-background rounded border border-border font-mono">esc</kbd>
                            Close
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Press <kbd className="px-2 py-1 bg-background rounded border border-border font-mono">K</kbd> anytime
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
