import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { tenantService } from '@/services/tenants';
import { workspaceService } from '@/services/workspaces';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import type { Tenant } from '@/types/models';

export function TenantOnboardingFlow() {
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1: Create Tenant
    const [tenantName, setTenantName] = useState('');
    const [tenantSlug, setTenantSlug] = useState('');

    // Step 2: Tenant List
    const [createdTenants, setCreatedTenants] = useState<Tenant[]>([]);
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');

    // Step 3: Workspace Mapping
    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceSlug, setWorkspaceSlug] = useState('');

    const handleTenantNameChange = (value: string) => {
        setTenantName(value);
        // Auto-generate slug
        if (!tenantSlug || tenantSlug === tenantName.toLowerCase().replace(/\s+/g, '-').slice(0, -1)) {
            setTenantSlug(value.toLowerCase().replace(/\s+/g, '-'));
        }
    };

    const handleWorkspaceNameChange = (value: string) => {
        setWorkspaceName(value);
        // Auto-generate slug
        if (!workspaceSlug || workspaceSlug === workspaceName.toLowerCase().replace(/\s+/g, '-').slice(0, -1)) {
            setWorkspaceSlug(value.toLowerCase().replace(/\s+/g, '-'));
        }
    };

    const handleCreateTenant = async () => {
        if (!tenantName || !tenantSlug) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const newTenant = await tenantService.create({
                name: tenantName,
                slug: tenantSlug,
            });

            setCreatedTenants([...createdTenants, newTenant]);
            setSelectedTenantId(newTenant.id);
            setTenantName('');
            setTenantSlug('');
            setCurrentStep(2);
        } catch (err: any) {
            setError(err.message || 'Failed to create tenant');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAnotherTenant = async () => {
        if (!tenantName || !tenantSlug) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const newTenant = await tenantService.create({
                name: tenantName,
                slug: tenantSlug,
            });

            setCreatedTenants([...createdTenants, newTenant]);
            setTenantName('');
            setTenantSlug('');
        } catch (err: any) {
            setError(err.message || 'Failed to create tenant');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTenant = async (tenantId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await tenantService.delete(tenantId);
            const updatedTenants = createdTenants.filter(t => t.id !== tenantId);
            setCreatedTenants(updatedTenants);

            if (selectedTenantId === tenantId && updatedTenants.length > 0) {
                setSelectedTenantId(updatedTenants[0].id);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete tenant');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteOnboarding = async () => {
        if (!workspaceName || !workspaceSlug || !selectedTenantId) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Create workspace with tenant mapping
            await workspaceService.create({
                name: workspaceName,
                slug: workspaceSlug,
                tenant_id: selectedTenantId,
            });

            // Refresh user profile to get updated tenant_id
            await refreshProfile();

            // Mark onboarding as complete
            localStorage.setItem('tenant_onboarding_completed', 'true');

            // Navigate to dashboard
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to complete onboarding');
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Create Tenant', description: 'Set up your organization' },
        { number: 2, title: 'Review Tenants', description: 'Manage your tenants' },
        { number: 3, title: 'Create Workspace', description: 'Map to workspace' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl"
            >
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= step.number
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {currentStep > step.number ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="text-sm font-medium">{step.title}</div>
                                        <div className="text-xs text-muted-foreground">{step.description}</div>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-0.5 flex-1 mx-4 transition-all ${currentStep > step.number ? 'bg-indigo-600' : 'bg-muted'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                                            <Building2 className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <CardTitle>Create Your First Tenant</CardTitle>
                                            <CardDescription>
                                                A tenant represents your organization or team
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tenant-name">Tenant Name</Label>
                                        <Input
                                            id="tenant-name"
                                            placeholder="e.g., Acme Corporation"
                                            value={tenantName}
                                            onChange={(e) => handleTenantNameChange(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tenant-slug">Tenant Slug</Label>
                                        <Input
                                            id="tenant-slug"
                                            placeholder="e.g., acme-corporation"
                                            value={tenantSlug}
                                            onChange={(e) => setTenantSlug(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Used in URLs. Must be unique and URL-friendly.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            onClick={handleCreateTenant}
                                            disabled={isLoading || !tenantName || !tenantSlug}
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create & Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Tenants</CardTitle>
                                    <CardDescription>
                                        Review your tenants or create additional ones
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Tenant List */}
                                    <div className="space-y-3">
                                        {createdTenants.map((tenant) => (
                                            <div
                                                key={tenant.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedTenantId === tenant.id
                                                        ? 'border-indigo-600 bg-indigo-500/5'
                                                        : 'border-border hover:border-indigo-400'
                                                    }`}
                                                onClick={() => setSelectedTenantId(tenant.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-500/10 rounded">
                                                            <Building2 className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{tenant.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {tenant.slug}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {selectedTenantId === tenant.id && (
                                                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTenant(tenant.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Create Another Tenant Form */}
                                    <div className="border-t pt-4 space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Plus className="w-4 h-4" />
                                            Create Another Tenant (Optional)
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                placeholder="Tenant name"
                                                value={tenantName}
                                                onChange={(e) => handleTenantNameChange(e.target.value)}
                                            />
                                            <Input
                                                placeholder="tenant-slug"
                                                value={tenantSlug}
                                                onChange={(e) => setTenantSlug(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleCreateAnotherTenant}
                                            disabled={isLoading || !tenantName || !tenantSlug}
                                            className="w-full"
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Tenant
                                        </Button>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-between gap-3 pt-4">
                                        <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button
                                            onClick={() => setCurrentStep(3)}
                                            disabled={!selectedTenantId}
                                        >
                                            Continue
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create Your Workspace</CardTitle>
                                    <CardDescription>
                                        Map your workspace to the selected tenant
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Selected Tenant Display */}
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <div className="text-sm text-muted-foreground mb-1">Selected Tenant</div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-indigo-600" />
                                            <span className="font-medium">
                                                {createdTenants.find(t => t.id === selectedTenantId)?.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="workspace-name">Workspace Name</Label>
                                        <Input
                                            id="workspace-name"
                                            placeholder="e.g., Production"
                                            value={workspaceName}
                                            onChange={(e) => handleWorkspaceNameChange(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="workspace-slug">Workspace Slug</Label>
                                        <Input
                                            id="workspace-slug"
                                            placeholder="e.g., production"
                                            value={workspaceSlug}
                                            onChange={(e) => setWorkspaceSlug(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Used in URLs. Must be unique.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-between gap-3 pt-4">
                                        <Button variant="outline" onClick={() => setCurrentStep(2)}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleCompleteOnboarding}
                                            disabled={isLoading || !workspaceName || !workspaceSlug}
                                        >
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Complete Setup
                                            <CheckCircle2 className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
