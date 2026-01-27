import React from 'react';
import { cn } from '@/lib/utils';

// Simple custom Tabs implementation since we didn't install radix-ui
// Actually, let's just make it a controlled component or simple state-based for now to avoid dependencies if not needed.
// But wait, standard is to use Radix UI. I didn't install it.
// I'll build a simple accessible Tabs component.

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

const TabsContext = React.createContext<{ value: string; setValue: (v: string) => void } | null>(null);

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className, children }: TabsProps) {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const setValue = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, className, children }: { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
                className
            )}
            onClick={() => context.setValue(value)}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, className, children }: { value: string } & React.HTMLAttributes<HTMLDivElement>) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
}
