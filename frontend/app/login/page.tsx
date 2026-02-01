"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch('http://localhost:8000/api/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Login failed');
            }

            const data = await res.json();
            // Store token in cookie (expires in 1 day)
            Cookies.set('admin_token', data.access_token, { expires: 1 });

            // Redirect to admin
            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05050A] flex items-center justify-center p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-primary/10 blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-brand-secondary/10 blur-[150px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-brand-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary border border-brand-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Enter your credentials to access the console</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-white placeholder-gray-600 transition-all outline-none"
                                placeholder="admin"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-white placeholder-gray-600 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold shadow-lg shadow-brand-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-center">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-semibold">Demo Credentials</p>
                        <div className="flex justify-center gap-4 text-sm">
                            <span className="text-gray-300">User: <span className="text-white font-mono font-bold">admin</span></span>
                            <span className="text-gray-300">Pass: <span className="text-white font-mono font-bold">admin123</span></span>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-xs mt-8">
                    Protected by Smart Promo Security Systems
                </p>
            </div>
        </div>
    );
}
