import * as React from "react"
import { useToast } from "./use-toast"
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "./Toast"

export function Toaster() {
    const { toasts, dismiss } = useToast()

    // Handle outside click to dismiss toasts
    React.useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if the click is inside a toast
            // We check for data-state="open" which is present on the Toast component
            const isToast = target.closest('[data-state="open"]');

            if (!isToast && toasts.length > 0) {
                // Dismiss all toasts
                toasts.forEach(t => dismiss(t.id));
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [toasts, dismiss]);

    return (
        <ToastProvider>
            <ToastViewport>
                {toasts.map(function ({ id, title, description, action, ...props }) {
                    return (
                        <Toast key={id} {...props}>
                            <div className="grid gap-1">
                                {title && <ToastTitle>{title}</ToastTitle>}
                                {description && (
                                    <ToastDescription>{description}</ToastDescription>
                                )}
                            </div>
                            {action}
                            <ToastClose onClick={() => dismiss(id)} />
                        </Toast>
                    )
                })}
            </ToastViewport>
        </ToastProvider>
    )
}
