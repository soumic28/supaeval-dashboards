import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';

interface KeyboardShortcutsHelpProps {
    open: boolean;
    onClose: () => void;
}

export function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
    const shortcutGroups = [
        {
            title: 'Search & Navigation',
            shortcuts: [
                { keys: ['K'], description: 'Global Search (Command Palette)', highlight: true },
                { keys: ['G', 'D'], description: 'Go to Dashboard' },
                { keys: ['G', 'E'], description: 'Go to Evaluations' },
                { keys: ['G', 'M'], description: 'Go to Metrics' },
            ]
        },
        {
            title: 'Actions',
            shortcuts: [
                { keys: ['N'], description: 'New Evaluation' },
                { keys: ['R'], description: 'Refresh Page' },
                { keys: ['Ctrl', 'S'], description: 'Save' },
            ]
        },
        {
            title: 'Help',
            shortcuts: [
                { keys: ['?'], description: 'Show Shortcuts' },
                { keys: ['Esc'], description: 'Close Dialog' },
            ]
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Speed up your workflow with keyboard shortcuts
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {shortcutGroups.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-sm font-semibold mb-3">{group.title}</h3>
                            <div className="space-y-2">
                                {group.shortcuts.map((shortcut, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIndex) => (
                                                <span key={keyIndex}>
                                                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono border border-border">
                                                        {key}
                                                    </kbd>
                                                    {keyIndex < shortcut.keys.length - 1 && (
                                                        <span className="mx-1 text-muted-foreground">+</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-muted p-3 rounded-lg mt-2">
                    <p className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-background rounded text-xs font-mono border border-border">?</kbd> anytime to see this dialog
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
