"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, DollarSign, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Scene3D from '@/components/3d/Scene3D';

interface HeroSlide {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_primary_url?: string; // New
    cta_secondary: string;
    cta_secondary_url?: string; // New
    style?: string; // 'gradient-indigo' | 'dark-mode' | 'light-mode'
    image_url?: string;
}

interface HeroProps {
    content: {
        slides?: HeroSlide[];
        // Fallback for backward compatibility or single slide
        title?: string;
        subtitle?: string;
        cta_primary?: string;
        cta_secondary?: string;
    };
}

export default function HeroSection({ content }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Normalize content to always be an array of slides
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

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (!content) return null;

    return (
        <section className="relative overflow-hidden min-h-[800px] flex items-center bg-gray-50">
            {/* 3D Background Layer */}
            <div className="absolute inset-0 z-0">
                <Scene3D />
            </div>

            {/* Carousel Items */}
            {slides.map((slide, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Styles - Made transparent for 3D visibility */}
                    <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="container mx-auto px-6 h-full flex items-center pt-20">
                        <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
                            {/* Text Content */}
                            <div className={`lg:w-1/2 space-y-8 ${idx === currentSlide ? 'animate-fade-in-up' : ''}`}>
                                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white">
                                    {slide.title}
                                </h1>
                                <p className="text-xl leading-relaxed max-w-lg text-gray-300">
                                    {slide.subtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={slide.cta_primary_url || "#"}
                                        className="px-8 py-4 rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-violet-600 shadow-brand-primary/20"
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
                                </div>
                            </div>

                            {/* Visual/Image */}
                            <div className="lg:w-1/2 relative hidden lg:block">
                                {slide.image_url ? (
                                    <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <img
                                            src={slide.image_url}
                                            alt={slide.title}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                ) : (
                                    <HeroVisual style={slide.style} />
                                )}
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
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
        <div className={`relative z-10 rounded-2xl shadow-2xl border p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
            <div className={`rounded-xl p-6 border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'
                }`}>
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
                        <div key={i} className="flex-1 bg-indigo-500/50 hover:bg-indigo-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
