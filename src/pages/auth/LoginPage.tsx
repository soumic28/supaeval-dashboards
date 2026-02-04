import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("demo@supaeval.com");
    const [password, setPassword] = useState("password123");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay for effect
        setTimeout(() => {
            login({ email, password });
            setIsLoading(false);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px]" />
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
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20"
                            >
                                <div className="w-8 h-8 bg-white rounded-lg opacity-20" />
                            </motion.div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                Welcome back
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Enter your credentials to access your dashboard
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary/50" />
                                    <span className="text-muted-foreground group-hover:text-white transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
                                    Forgot password?
                                </a>
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
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <button className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm font-medium text-white group">
                                <Github className="w-5 h-5" />
                                <span>Continue with GitHub</span>
                            </button>
                        </div>

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-white hover:text-primary font-medium transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
