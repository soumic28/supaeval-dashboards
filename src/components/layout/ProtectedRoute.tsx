import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>; // Or a nice spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
