import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>; // Or a nice spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Require onboarding if they don't have a workspace assigned
    if (isAuthenticated && user?.workspace_id == null) {
        return <Navigate to="/onboarding/tenant" replace />;
    }

    return <Outlet />;
}
