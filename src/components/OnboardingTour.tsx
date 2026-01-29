import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOUR_STEPS } from '@/config/tourSteps';

interface OnboardingTourProps {
    show: boolean;
    onComplete: () => void;
}

export function OnboardingTour({ show, onComplete }: OnboardingTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = TOUR_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TOUR_STEPS.length - 1;

    useEffect(() => {
        if (!show) return;

        const updateTargetPosition = () => {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);

                // Scroll element into view
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        updateTargetPosition();
        window.addEventListener('resize', updateTargetPosition);
        window.addEventListener('scroll', updateTargetPosition);

        return () => {
            window.removeEventListener('resize', updateTargetPosition);
            window.removeEventListener('scroll', updateTargetPosition);
        };
    }, [currentStep, show, step.target]);

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const getTooltipPosition = () => {
        if (!targetRect) return { top: '50%', left: '50%' };

        const padding = 16;
        let top = 0;
        let left = 0;

        switch (step.placement) {
            case 'bottom':
                top = targetRect.bottom + padding;
                left = targetRect.left + targetRect.width / 2;
                break;
            case 'top':
                top = targetRect.top - padding;
                left = targetRect.left + targetRect.width / 2;
                break;
            case 'right':
                top = targetRect.top + targetRect.height / 2;
                left = targetRect.right + padding;
                break;
            case 'left':
                top = targetRect.top + targetRect.height / 2;
                left = targetRect.left - padding;
                break;
        }

        return { top: `${top}px`, left: `${left}px` };
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            {/* Dark overlay with spotlight cutout */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999]"
                style={{ pointerEvents: 'none' }}
            >
                {/* Dark background */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Spotlight highlight */}
                {targetRect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute border-4 border-primary rounded-lg shadow-2xl"
                        style={{
                            top: targetRect.top - 8,
                            left: targetRect.left - 8,
                            width: targetRect.width + 16,
                            height: targetRect.height + 16,
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                        }}
                    />
                )}

                {/* Tooltip */}
                <motion.div
                    ref={tooltipRef}
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bg-background border border-border rounded-lg shadow-xl p-6 max-w-sm"
                    style={{
                        ...getTooltipPosition(),
                        transform: step.placement === 'left' || step.placement === 'right'
                            ? 'translate(-50%, -50%)'
                            : 'translate(-50%, 0)',
                        pointerEvents: 'auto',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-3 right-3 p-1 hover:bg-muted rounded-sm transition-colors"
                        aria-label="Skip tour"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Content */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold pr-6">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{step.content}</p>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-2">
                            {TOUR_STEPS.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${index === currentStep
                                        ? 'bg-primary'
                                        : index < currentStep
                                            ? 'bg-primary/50'
                                            : 'bg-muted'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={handleSkip}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Skip tour
                            </button>

                            <div className="flex items-center gap-2">
                                {!isFirstStep && (
                                    <button
                                        onClick={handlePrevious}
                                        className="px-3 py-1.5 text-sm border border-border hover:bg-accent rounded-md transition-colors flex items-center gap-1"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-1"
                                >
                                    {isLastStep ? 'Finish' : 'Next'}
                                    {!isLastStep && <ChevronRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Step counter */}
                        <p className="text-xs text-center text-muted-foreground">
                            Step {currentStep + 1} of {TOUR_STEPS.length}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
