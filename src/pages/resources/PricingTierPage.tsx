import { Check, Calendar, Zap, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaces } from '@/hooks/queries/use-workspaces';

const pricingPlans = [
    {
        name: 'Starter',
        price: '$0',
        description: 'For individuals and hobbyists starting out.',
        features: [
            'Up to 3 evaluation suites',
            '1,000 runs per month',
            'Community support',
            'Basic metrics',
            'Single user'
        ],
        current: false,
        buttonText: 'Downgrade',
        buttonVariant: 'outline' as const
    },
    {
        name: 'Standard',
        price: '$49',
        period: '/month',
        description: 'For small teams needing more power.',
        features: [
            'Unlimited evaluation suites',
            '10,000 runs per month',
            'Email support',
            'Advanced metrics & analytics',
            'Up to 5 team members',
            'API access'
        ],
        current: true,
        popular: true,
        buttonText: 'Current Plan',
        buttonVariant: 'default' as const
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For unlimited scale and security.',
        features: [
            'Unlimited runs',
            'Dedicated success manager',
            'Custom integrations',
            'SSO & audit logs',
            'Unlimited team members',
            'On-premise deployment option'
        ],
        current: false,
        buttonText: 'Contact Sales',
        buttonVariant: 'outline' as const
    }
];

const PricingTierPage = () => {
    const { user } = useAuth();
    const { workspaces } = useWorkspaces();
    const activeWorkspace = workspaces?.find(w => w.id === user?.workspace_id);

    // Mock usage data based on "Standard Plan"
    const usage = {
        runs: { used: 3450, total: 10000 },
        storage: { used: 1.2, total: 5, unit: 'GB' }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            {/* Subscription & Billing Section */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscription & Billing</h1>
                        <p className="text-muted-foreground mt-1">Manage your plan, billing details, and usage.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Current Plan Card */}
                    <Card className="md:col-span-2 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="border-primary text-primary bg-primary/10">Active</Badge>
                                        <span className="text-sm text-muted-foreground font-mono">
                                            ID: {activeWorkspace?.subscription_id || 'sub_1234567890'}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl">{activeWorkspace?.plan || 'Standard Plan'}</CardTitle>
                                    <CardDescription>
                                        Renews on March 1, 2026 • <span className="font-medium text-foreground">$49.00/month</span>
                                    </CardDescription>
                                </div>
                                <Link to="/settings?tab=billing">
                                    <Button variant="outline">Manage Billing</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Zap className="w-4 h-4" />
                                        <span>Evaluation Runs</span>
                                    </div>
                                    <span className="font-medium">{(usage.runs.used / usage.runs.total * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={(usage.runs.used / usage.runs.total) * 100} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{usage.runs.used.toLocaleString()} runs used</span>
                                    <span>{usage.runs.total.toLocaleString()} limit</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <HardDrive className="w-4 h-4" />
                                        <span>Storage</span>
                                    </div>
                                    <span className="font-medium">{(usage.storage.used / usage.storage.total * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={(usage.storage.used / usage.storage.total) * 100} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{usage.storage.used} {usage.storage.unit} used</span>
                                    <span>{usage.storage.total} {usage.storage.unit} limit</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center">
                                    {/* Simplified Card Icon */}
                                    <div className="w-8 h-4 bg-zinc-600 rounded-sm" />
                                </div>
                                <div>
                                    <div className="font-medium">Visa ending in 4242</div>
                                    <div className="text-xs text-muted-foreground">Expires 12/28</div>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Next invoice: Mar 1, 2026</span>
                                </div>
                                <div>Amount: $49.00</div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link to="/settings?tab=billing" className="w-full">
                                <Button variant="ghost" className="w-full text-foreground hover:bg-muted">Update Payment Method</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Available Plans</h2>
                <p className="text-xl text-muted-foreground">
                    Upgrade or downgrade your plan at any time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 -mr-2 -mt-2">
                                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="mt-4 flex items-baseline text-foreground">
                                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                                {plan.period && <span className="ml-1 text-xl font-semibold text-muted-foreground">{plan.period}</span>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                                        <span className="text-sm text-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={plan.buttonVariant}
                                disabled={plan.name === (activeWorkspace?.plan || 'Standard')}
                            >
                                {plan.name === (activeWorkspace?.plan || 'Standard') ? 'Current Plan' : plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-16 text-center">
                <p className="text-muted-foreground">
                    Have questions? <a href="#" className="text-primary hover:underline">Contact our support team</a>
                </p>
            </div>
        </div>
    );
};

export default PricingTierPage;
