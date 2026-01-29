import { type ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedTooltipProps {
    children: ReactNode;
    title?: string;
    content: string;
    formula?: string;
    example?: string;
    learnMoreHref?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}

export function EnhancedTooltip({
    children,
    title,
    content,
    formula,
    example,
    learnMoreHref,
    side = 'right',
    className
}: EnhancedTooltipProps) {
    return (
        <TooltipPrimitive.Provider delayDuration={200}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    <span className="inline-flex items-center gap-1 cursor-help">
                        {children}
                        <Info className="w-4 h-4 text-muted-foreground" />
                    </span>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Content
                    side={side}
                    className={cn(
                        'z-50 max-w-sm overflow-hidden rounded-md border border-border bg-popover px-4 py-3 shadow-md',
                        className
                    )}
                    sideOffset={5}
                >
                    {title && (
                        <h4 className="font-medium text-sm mb-2">{title}</h4>
                    )}
                    <p className="text-sm text-muted-foreground mb-3">
                        {content}
                    </p>

                    {formula && (
                        <div className="bg-muted p-3 rounded text-xs mb-3 font-mono">
                            {formula}
                        </div>
                    )}

                    {example && (
                        <>
                            <p className="text-xs text-muted-foreground mb-2 font-medium">
                                Example:
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                                {example}
                            </p>
                        </>
                    )}

                    {learnMoreHref && (
                        <a
                            href={learnMoreHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            Learn more
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                    <TooltipPrimitive.Arrow className="fill-border" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
