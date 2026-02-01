"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'py-4'
                    : 'py-6'
                    }`}
            >
                <div className={`container mx-auto px-6 transition-all duration-300 ${scrolled ? 'max-w-6xl' : ''
                    }`}>
                    <div className={`backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${scrolled ? 'bg-brand-surface/90' : 'bg-brand-surface/70'
                        }`}>
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                            <div className="w-9 h-9 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center transform rotate-3 shadow-lg shadow-brand-primary/30">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Smart Promo</span>
                        </a>

                        {/* Links (Desktop) */}
                        <div className="hidden md:flex items-center gap-8">
                            <div className="flex gap-6 text-sm font-medium text-gray-300">
                                <Link href="#features" className="hover:text-brand-primary transition-colors flex items-center gap-1">Features</Link>
                                <Link href="#how-it-works" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                                    How it Works
                                </Link>
                                <Link href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</Link>
                                <Link href="#tools" className="hover:text-brand-primary transition-colors text-brand-primary-light font-semibold">Premium Tool</Link>
                            </div>

                            <div className="h-6 w-px bg-white/10"></div>

                            <div className="flex gap-4 items-center">
                                <Link href="/admin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    Admin
                                </Link>
                                <button className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-full hover:bg-violet-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 group shadow-brand-primary/20">
                                    Start Free Trial
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden text-gray-600 p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 pt-32 px-8 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col gap-6 text-xl font-medium text-gray-900">
                    <Link href="#features" className="border-b border-gray-100 pb-4" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                    <Link href="#how-it-works" className="border-b border-gray-100 pb-4" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
                    <Link href="#pricing" className="border-b border-gray-100 pb-4" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/admin" className="text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Admin Console</Link>
                    <div className="pt-4">
                        <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
