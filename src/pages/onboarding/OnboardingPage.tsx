import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WelcomeStep from './steps/WelcomeStep';
import ApiKeyStep from './steps/ApiKeyStep';
import LiveCaptureStep from './steps/LiveCaptureStep';
import FirstDashboardStep from './steps/FirstDashboardStep';
import AdapterReviewStep from './steps/AdapterReviewStep';
import ActivatedStep from './steps/ActivatedStep';
import MetricPacksStep from './steps/MetricPacksStep';

import type { OnboardingData } from '../../types/onboarding';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        apiKey: '',
        tracesCollected: 0,
        adapterConfidence: 0.32,
        agentMode: 'RAG Agent'
    });

    const nextStep = () => setStep(prev => prev + 1);

    const prevStep = () => {
        if (step === 6) {
            setStep(4);
        } else if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <WelcomeStep onNext={nextStep} />;
            case 2:
                // Generate a mock API key if not exists
                if (!data.apiKey) updateData({ apiKey: 'sk-supaeval-test-8f92a3b' });
                return <ApiKeyStep onNext={nextStep} apiKey={data.apiKey || 'sk-supaeval-test-8f92a3b'} />;
            case 3:
                return <LiveCaptureStep onNext={nextStep} data={data} updateData={updateData} />;
            case 4:
                return <FirstDashboardStep onNext={() => setStep(6)} />; // Skip to 6 as per user flow
            case 6:
                return <AdapterReviewStep onNext={nextStep} />;
            case 7:
                return <ActivatedStep onNext={nextStep} />;
            case 8:
                return <MetricPacksStep onNext={() => navigate('/')} data={data} />;
            default:
                return <WelcomeStep onNext={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans mb-10">
            {/* Header */}
            <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-zinc-900 rounded-md flex items-center justify-center">
                            <span className="font-bold text-white text-xs">S</span>
                        </div>
                        <span className="font-semibold text-zinc-900 tracking-tight">SupaEval</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Step {step > 4 ? step - 1 : step} of 7
                        </div>
                        <div className="h-1.5 w-32 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-zinc-900 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 8) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-start justify-center pt-12 md:pt-20 px-6 pb-20">
                <div className="w-full max-w-4xl">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                    )}
                    {renderStep()}
                </div>
            </main>
        </div>
    );
};

export default OnboardingPage;
