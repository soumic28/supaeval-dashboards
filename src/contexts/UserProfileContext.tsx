import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'manager' | 'developer' | 'student' | 'investor' | 'researcher';
export type ComplexityMode = 'simple' | 'balanced' | 'advanced';

interface UserProfile {
    role: UserRole;
    complexity: ComplexityMode;
    showGamification: boolean;
    showOnboarding: boolean;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        reducedMotion: boolean;
        fontSize: 'normal' | 'large';
    };
}

interface UserProfileContextValue {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;
    isSimpleMode: boolean;
    isAdvancedMode: boolean;
}

const defaultProfile: UserProfile = {
    role: 'developer',
    complexity: 'balanced',
    showGamification: true,
    showOnboarding: true,
    preferences: {
        theme: 'system',
        reducedMotion: false,
        fontSize: 'normal',
    },
};

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile>(() => {
        // Load from localStorage if available
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : defaultProfile;
    });

    // Save to localStorage whenever profile changes
    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const value: UserProfileContextValue = {
        profile,
        updateProfile,
        isSimpleMode: profile.complexity === 'simple',
        isAdvancedMode: profile.complexity === 'advanced',
    };

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within UserProfileProvider');
    }
    return context;
}
