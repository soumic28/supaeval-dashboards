import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

// We map out the navigation structure here to resolve breadcrumb labels based on URL paths.
// This matches the terminology used in Sidebar.tsx.
const routeMapping: Record<string, string> = {
    '/': 'Home',
    '/datasets': 'Datasets',
    '/datasets/my-datasets': 'My Datasets',
    '/datasets/marketplace': 'Marketplace',
    '/datasets/synthetic-data': 'Synthetic Data',
    '/evaluations': 'Evaluations',
    '/evaluations/runs': 'All Runs',
    '/evaluations/traces': 'Traces',
    '/evaluations/scheduled': 'Scheduled',
    '/evaluations/prompt-playground': 'Prompt Playground',
    '/configurations': 'Configurations',
    '/configurations/agents': 'Agent Config',
    '/configurations/metrics': 'Metrics Config',
    '/benchmarks': 'Benchmarks',
    '/benchmarks/comparisons': 'Comparisons',
    '/benchmarks/regression': 'Regression',
    '/resource': 'Resource Management',
    '/resource/cost': 'Cost Analysis',
    '/resource/pricing': 'Pricing Tier',
    '/resource/usage': 'Usage management',
    '/metrics': 'Metrics',
    '/agents': 'Agents',
    '/agents/connected': 'Connected Agents',
    '/agents/endpoints': 'Endpoints',
    '/rlhf': 'RLHF',
    '/sdk': 'SDK & API',
    '/settings': 'Settings',
    '/team': 'Team',
};

export function GlobalBreadcrumbs() {
    const location = useLocation();

    const breadcrumbItems = useMemo(() => {
        const paths = location.pathname.split('/').filter(Boolean);
        const items: Array<{ label: string; href?: string }> = [{ label: 'Home', href: '/' }];

        let currentPath = '';

        paths.forEach((path, index) => {
            currentPath += `/${path}`;
            const isLast = index === paths.length - 1;

            // Look up the label from our mapping, or fallback to capitalizing the path segment
            const label = routeMapping[currentPath] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

            const item: { label: string; href?: string } = {
                label,
            };

            // Only provide an href if it's not the last item
            if (!isLast) {
                item.href = currentPath;
            }

            items.push(item);
        });

        return items;
    }, [location.pathname]);

    // Don't show breadcrumbs on the home page itself as it's redundant
    if (location.pathname === '/' || breadcrumbItems.length <= 1) {
        return null;
    }

    return (
        <div className="mb-4 px-2">
            <Breadcrumb items={breadcrumbItems} />
        </div>
    );
}
