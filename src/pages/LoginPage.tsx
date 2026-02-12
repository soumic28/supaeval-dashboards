import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, Loader2, Eye, EyeOff, Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModeToggle } from '@/components/ModeToggle';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    // Animated code snippets
    const codeSnippets = [
        "const agent = new AIAgent();",
        "agent.evaluate(dataset);",
        "const metrics = await analyze();",
        "console.log('Accuracy: 94.2%');",
        "model.train(iterations=1000);",
        "pipeline.execute();"
    ];
    const [currentSnippet, setCurrentSnippet] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    // Typing animation effect
    useEffect(() => {
        const snippet = codeSnippets[currentSnippet];

        if (charIndex < snippet.length) {
            const timeout = setTimeout(() => {
                setDisplayText(snippet.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, 80);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setCharIndex(0);
                setDisplayText('');
                setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [charIndex, currentSnippet]);

    const onSubmit = async (data: any) => {
        setError(null);
        try {
            await login({ email: data.email, password: data.password });
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Failed to login. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background font-mono selection:bg-primary/30">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-[#050506] p-12 text-white relative overflow-hidden border-r border-[#1F1F23]">
                {/* Tech Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F1F23_1px,transparent_1px),linear-gradient(to_bottom,#1F1F23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-2xl font-bold tracking-tighter">
                        <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center rounded-sm">
                            <Terminal className="h-5 w-5 text-indigo-500" />
                        </div>
                        <span className="font-mono">SUPA_EVAL</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-4xl font-bold tracking-tight mb-4">
                            Welcome Back
                        </h1>
                        <p className="text-lg text-zinc-400 leading-relaxed border-l-2 border-indigo-500/50 pl-4">
                            Sign in to access your agent evaluation dashboard.
                        </p>
                    </motion.div>

                    {/* Animated Code Terminal */}
                    <motion.div
                        className="bg-[#121214] border border-[#1F1F23] p-4 rounded-sm font-mono text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2 mb-3 text-zinc-500">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
                            </div>
                            <span className="text-xs">terminal.sh</span>
                        </div>
                        <div className="text-indigo-400 min-h-[24px]">
                            <span className="text-zinc-500">$ </span>
                            {displayText}
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2 h-4 bg-indigo-500 ml-0.5"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            className="bg-[#121214] border border-[#1F1F23] p-4 rounded-sm relative overflow-hidden"
                            whileHover={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />
                            <div className="flex items-center gap-2 text-zinc-400 mb-2 relative z-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Cpu className="w-4 h-4" />
                                </motion.div>
                                <span className="text-xs uppercase tracking-wider">Metric Analysis</span>
                            </div>
                            <div className="text-2xl font-bold text-white relative z-10">Real-time</div>
                        </motion.div>
                        <motion.div
                            className="bg-[#121214] border border-[#1F1F23] p-4 rounded-sm"
                            whileHover={{ borderColor: 'rgba(99, 102, 241, 0.3)' }}
                        >
                            <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                <Terminal className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">Debug Mode</span>
                            </div>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                Active
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-green-500"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-zinc-600 font-mono">
                    <div>ID: SUPA-2026-X</div>
                    <div>STATUS: ONLINE</div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 bg-background relative">
                <div className="absolute top-4 right-4">
                    <ModeToggle />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            Sign In
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and password to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@organization.com"
                                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all ${errors.email ? "border-red-500/50" : ""}`}
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500/80 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {String(errors.email.message)}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-indigo-500 hover:text-indigo-400 transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all pr-10 ${errors.password ? "border-red-500/50" : ""}`}
                                        {...register("password", { required: "Password is required" })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500/80 flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {String(errors.password.message)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 border border-red-500/20 bg-red-500/5 text-sm text-red-400 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all rounded-sm uppercase tracking-wider text-xs"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-xs text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
