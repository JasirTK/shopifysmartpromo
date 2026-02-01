"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Scene3D from '@/components/3d/Scene3D';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSlide {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_primary_url?: string;
    cta_secondary: string;
    cta_secondary_url?: string;
    style?: string;
    image_url?: string;
}

interface HeroProps {
    content: {
        slides?: HeroSlide[];
        title?: string;
        subtitle?: string;
        cta_primary?: string;
        cta_secondary?: string;
    };
}

export default function HeroSection({ content }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides: HeroSlide[] = content?.slides || [
        {
            title: content?.title || "Welcome",
            subtitle: content?.subtitle || "",
            cta_primary: content?.cta_primary || "Get Started",
            cta_primary_url: "#",
            cta_secondary: content?.cta_secondary || "Learn More",
            cta_secondary_url: "#",
            style: 'gradient-indigo'
        }
    ];

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000); // Slower for nicer reading
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (!content) return null;

    return (
        <section className="relative overflow-hidden min-h-[800px] flex items-center bg-gray-50">
            <div className="absolute inset-0 z-0">
                <Scene3D />
            </div>

            {/* Carousel Items */}
            {slides.map((slide, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Simplified Background - No heavy blurs */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-transparent"></div>

                    <div className="container mx-auto px-6 h-full flex items-center pt-20">
                        <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
                            {/* Text Content */}
                            <div className="lg:w-1/2 space-y-8 relative z-20">
                                <motion.h1
                                    key={`title-${idx}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    key={`desc-${idx}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-xl leading-relaxed max-w-lg text-gray-300"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <motion.div
                                    key={`cta-${idx}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="flex flex-col sm:flex-row gap-4"
                                >
                                    <Link
                                        href={slide.cta_primary_url || "#"}
                                        className="px-8 py-4 rounded-full font-semibold transition-all hover:-translate-y-1 flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-violet-600"
                                    >
                                        {slide.cta_primary}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={slide.cta_secondary_url || "#"}
                                        className="px-8 py-4 border rounded-full font-semibold transition-all border-gray-700 text-white hover:bg-white/10 flex items-center justify-center"
                                    >
                                        {slide.cta_secondary}
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Visual/Image - Simplified Entry */}
                            <div className="lg:w-1/2 relative hidden lg:block z-20">
                                <motion.div
                                    key={`img-${idx}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {slide.image_url ? (
                                        <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                                            <img
                                                src={slide.image_url}
                                                alt={slide.title}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <HeroVisual style={slide.style} />
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-indigo-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

// Sub-component for the visual to keep main cleaner
function HeroVisual({ style }: { style?: string }) {
    const isDark = style === 'dark-mode';

    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`relative z-10 rounded-2xl shadow-2xl border p-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        >
            <div className={`rounded-xl p-6 border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-2">
                        <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        <div className={`h-8 w-48 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-900'}`}></div>
                    </div>
                    <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-500">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Users className="w-4 h-4" /> Visitors
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>12,405</div>
                        <div className="text-green-500 text-sm font-medium">+12%</div>
                    </div>
                    <div className={`p-4 rounded-lg shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <DollarSign className="w-4 h-4" /> Revenue
                        </div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>$45,200</div>
                        <div className="text-green-500 text-sm font-medium">+8%</div>
                    </div>
                </div>

                <div className={`h-32 rounded-lg border p-4 flex items-end gap-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    {[40, 60, 45, 70, 85, 65, 90, 80].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                            className="flex-1 bg-indigo-500/50 hover:bg-indigo-500 transition-colors rounded-t-sm"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
