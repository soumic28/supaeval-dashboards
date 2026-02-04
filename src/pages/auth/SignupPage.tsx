import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay for effect
        setTimeout(() => {
            // For mock/demo purposes, signup just logs you in with the provided credentials
            login({ email, password });
            setIsLoading(false);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
                <div className="absolute -bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="backdrop-blur-xl bg-card/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                Create Account
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Get started with your free account today
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="space-y-4">
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all outline-none text-sm"
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all outline-none text-sm"
                                        placeholder="Email address"
                                    />
                                </div>

                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all outline-none text-sm"
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground text-center px-4">
                                By creating an account, you agree to our{' '}
                                <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-white/5"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <button className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm font-medium text-white group">
                                <Github className="w-5 h-5" />
                                <span>Sign up with GitHub</span>
                            </button>
                        </div>

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white hover:text-primary font-medium transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
