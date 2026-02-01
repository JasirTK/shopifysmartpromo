"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Scene3D from '@/components/3d/Scene3D';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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
        }, 8000); // 8s per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (!content) return null;

    // Animation Variants
    const letterAnim = {
        initial: { y: "100%" },
        animate: {
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const containerAnim = {
        animate: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    return (
        <section className="relative overflow-hidden min-h-[850px] flex items-center bg-[#05050A]"> {/* Dark Background Base */}
            {/* 3D Scene - Interactive Depth Layer */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
                <Scene3D />
            </div>

            {/* Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/90 to-transparent pointer-events-none z-0" />

            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-secondary/10 rounded-full blur-[150px] pointer-events-none" />


            {/* Content Container */}
            <div className="container mx-auto px-6 h-full flex items-center relative z-10 pt-20">
                <div className="w-full relative">
                    {slides.map((slide, idx) => (
                        idx === currentSlide && (
                            <div key={idx} className="flex flex-col lg:flex-row items-center gap-16 w-full">

                                {/* Left: Text Content */}
                                <div className="lg:w-1/2 space-y-10">
                                    {/* Masked Title Reveal */}
                                    <motion.div
                                        className="space-y-2 overflow-hidden"
                                        variants={containerAnim}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        <div className="overflow-hidden">
                                            <motion.h1 variants={letterAnim} className="text-6xl lg:text-8xl font-bold tracking-tight text-white leading-tight">
                                                {slide.title.split(" ").slice(0, 3).join(" ")} {/* Split title for effect if needed, or just animate whole block */}
                                            </motion.h1>
                                        </div>
                                        <div className="overflow-hidden">
                                            <motion.h1 variants={letterAnim} className="text-6xl lg:text-8xl font-bold tracking-tight text-brand-primary leading-tight">
                                                {slide.title.split(" ").slice(3).join(" ")}
                                            </motion.h1>
                                        </div>
                                    </motion.div>

                                    {/* Description Fade */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="text-xl leading-relaxed max-w-lg text-gray-400"
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    {/* Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.8 }}
                                        className="flex flex-col sm:flex-row gap-4"
                                    >
                                        <Link
                                            href={slide.cta_primary_url || "#"}
                                            className="px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-violet-600 shadow-[0_0_30px_-5px_var(--color-brand-primary)]"
                                        >
                                            {slide.cta_primary}
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                        <Link
                                            href={slide.cta_secondary_url || "#"}
                                            className="px-8 py-4 border rounded-full font-semibold transition-all border-white/20 text-white hover:bg-white/10 flex items-center justify-center backdrop-blur-sm"
                                        >
                                            {slide.cta_secondary}
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Right: Hero Visual with Parallax Hover */}
                                <div className="lg:w-1/2 relative hidden lg:flex justify-center items-center perspective-[2000px]">
                                    <motion.div
                                        initial={{ opacity: 0, rotateX: 10, rotateY: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }} // Parallax feel
                                        className="relative z-10"
                                        style={{ transformStyle: "preserve-3d" }} // 3D Tilt support
                                    >
                                        {slide.image_url ? (
                                            <div className="relative z-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 bg-brand-surface/50 backdrop-blur-xl">
                                                <img
                                                    src={slide.image_url}
                                                    alt={slide.title}
                                                    className="w-full h-auto object-cover max-h-[600px]"
                                                />
                                            </div>
                                        ) : (
                                            <HeroVisual style={slide.style} />
                                        )}
                                    </motion.div>

                                    {/* Decorative Glow behind visual */}
                                    <div className="absolute inset-0 bg-brand-primary/20 blur-[100px] -z-10 rounded-full scale-75 animate-pulse-slow"></div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* Slider Controls */}
            {slides.length > 1 && (
                <>
                    {/* Dots Indicator */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                                    ? "w-8 bg-brand-primary shadow-[0_0_10px_var(--color-brand-primary)]"
                                    : "w-2 bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrow Navigation */}
                    <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                        <button
                            onClick={prevSlide}
                            className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
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
        <div className={`relative z-10 rounded-3xl shadow-2xl border p-3 bg-white/5 border-white/10 backdrop-blur-xl`}>
            <div className={`rounded-2xl p-8 border bg-[#0F111A]/80 border-white/10 min-w-[500px]`}>
                <div className="flex justify-between items-center mb-10">
                    <div className="space-y-3">
                        <div className="h-5 w-40 rounded-full bg-white/10 animate-pulse"></div>
                        <div className="h-10 w-64 rounded-lg bg-white/5"></div>
                    </div>
                    <div className="h-12 w-12 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <Users className="w-4 h-4" /> Visitors
                        </div>
                        <div className="text-3xl font-bold text-white">24,500</div>
                        <div className="text-brand-accent text-sm font-medium mt-1">+18% vs last week</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <DollarSign className="w-4 h-4" /> Revenue
                        </div>
                        <div className="text-3xl font-bold text-white">$68,200</div>
                        <div className="text-brand-accent text-sm font-medium mt-1">+24% vs last week</div>
                    </div>
                </div>

                {/* Animated Chart Bars */}
                <div className="h-40 rounded-xl border border-white/5 bg-white/5 p-6 flex items-end gap-3">
                    {[35, 55, 45, 75, 60, 85, 95, 80].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                            className="flex-1 bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-md opacity-80 hover:opacity-100 transition-opacity"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
