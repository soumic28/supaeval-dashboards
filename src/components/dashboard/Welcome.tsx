
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";

export function Welcome() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    const userName = user?.name || "User";
    const initials = userName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Get current time of day for greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-14 w-14 border-2 border-primary/10">
                <AvatarImage src={user?.avatar_url} alt={userName} />
                <AvatarFallback className="text-lg font-semibold bg-primary/5 text-primary">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    {greeting}, {userName}
                </h1>

            </div>
        </div>
    );
}
