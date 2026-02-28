import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

export const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        className={cn(
            'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className
        )}
        {...props}
        ref={ref}
    />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

export const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
        side?: 'top' | 'bottom' | 'left' | 'right',
        resizable?: boolean,
        defaultWidth?: number
    }
>(({ side = 'right', className, children, resizable = true, defaultWidth = 800, ...props }, forwardedRef) => {
    const [width, setWidth] = React.useState(defaultWidth);
    const isDragging = React.useRef(false);
    const dragStartX = React.useRef(0);
    const dragStartWidth = React.useRef(0);
    const contentRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;

            // the panel is on the right, so moving left (negative deltaX) INCREASES width
            const deltaX = dragStartX.current - e.clientX;
            let newWidth = dragStartWidth.current + deltaX;

            if (newWidth < 350) newWidth = 350; // Minimum width
            if (newWidth > window.innerWidth * 0.95) newWidth = window.innerWidth * 0.95; // Max width

            if (contentRef.current) {
                contentRef.current.style.width = `${newWidth}px`;
            }
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                if (contentRef.current) {
                    setWidth(parseFloat(contentRef.current.style.width));
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only handle left click
        if (e.button !== 0) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartWidth.current = contentRef.current ? contentRef.current.getBoundingClientRect().width : width;

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        // Prevent text selection during drag initiation
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={(node: HTMLDivElement | null) => {
                    contentRef.current = node;
                    if (typeof forwardedRef === 'function') {
                        forwardedRef(node);
                    } else if (forwardedRef) {
                        forwardedRef.current = node;
                    }
                }}
                style={resizable ? { width, maxWidth: '95vw' } : undefined}
                className={cn(
                    'fixed z-50 gap-4 bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right flex flex-col',
                    !resizable && 'w-3/4 sm:max-w-xl',
                    className
                )}
                {...props}
            >
                {resizable && (
                    <div
                        onMouseDown={handleMouseDown}
                        className="absolute left-0 top-0 bottom-0 w-4 cursor-col-resize hover:bg-primary/5 transition-colors z-[60] flex items-center justify-center -translate-x-1/2 group"
                    >
                        <div className="h-10 w-1 bg-border rounded-full group-hover:bg-primary transition-colors flex items-center justify-center" />
                    </div>
                )}
                {children}
                <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-foreground z-50 bg-background/50 backdrop-blur-sm p-1">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
            </SheetPrimitive.Content>
        </SheetPortal>
    );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

export const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col space-y-2 text-center sm:text-left shrink-0',
            className
        )}
        {...props}
    />
);
SheetHeader.displayName = 'SheetHeader';

export const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 shrink-0 mt-4',
            className
        )}
        {...props}
    />
);
SheetFooter.displayName = 'SheetFooter';

export const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn('text-lg font-semibold text-foreground', className)}
        {...props}
    />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
