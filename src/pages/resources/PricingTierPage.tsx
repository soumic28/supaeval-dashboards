import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Simple, transparent pricing</h1>
                <p className="text-xl text-muted-foreground">
                    Choose the plan that's right for your team.
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
                                disabled={plan.current}
                            >
                                {plan.buttonText}
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
