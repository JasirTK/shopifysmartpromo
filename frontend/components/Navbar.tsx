"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

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
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
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
                            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Sidebar (Admin Style) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0F111A] border-r border-white/10 z-50 p-6 shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                    <span className="text-white font-bold text-xl">S</span>
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">Smart Promo</span>
                            </div>

                            {/* Menu Items */}
                            <div className="flex-1 flex flex-col gap-2">
                                <MobileNavLink href="#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
                                <MobileNavLink href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</MobileNavLink>
                                <MobileNavLink href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
                                <MobileNavLink href="#tools" onClick={() => setMobileMenuOpen(false)} isSpecial>Premium Tools</MobileNavLink>
                            </div>

                            {/* Footer / CTA */}
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <Link
                                    href="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-center w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                                >
                                    Admin Console
                                </Link>
                                <button className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-violet-600 transition-all flex items-center justify-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function MobileNavLink({ href, children, onClick, isSpecial }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${isSpecial
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
        >
            {children}
        </Link>
    );
}
