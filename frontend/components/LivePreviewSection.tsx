"use client";
// Force update

import { useState, useEffect } from 'react';
import { Palette, Type, Layout, Copy, Check, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
    id: string;
    text: string;
    bgColor: string;
    textColor: string;
}

export default function LivePreviewSection() {
    const [banners, setBanners] = useState<BannerSlide[]>([
        { id: '1', text: "🎉 Summer Sale: Get 20% OFF everything!", bgColor: "#4f46e5", textColor: "#ffffff" },
        { id: '2', text: "🚚 Free Shipping on orders over $50", bgColor: "#10b981", textColor: "#ffffff" }
    ]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    // Auto-rotate preview every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPreviewIndex((prev) => (prev + 1) % banners.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const handleCopy = () => {
        const activeBanner = banners[activeIndex];
        navigator.clipboard.writeText(`<div style="background-color: ${activeBanner.bgColor}; color: ${activeBanner.textColor}; padding: 10px; text-align: center;">${activeBanner.text}</div>`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateBanner = (key: keyof BannerSlide, value: string) => {
        const newBanners = [...banners];
        newBanners[activeIndex] = { ...newBanners[activeIndex], [key]: value };
        setBanners(newBanners);
    };

    const addBanner = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setBanners([...banners, { id: newId, text: "New Announcement", bgColor: "#000000", textColor: "#ffffff" }]);
        setActiveIndex(banners.length); // Switch to new one
    };

    const removeBanner = (index: number) => {
        if (banners.length <= 1) return;
        const newBanners = banners.filter((_, i) => i !== index);
        setBanners(newBanners);
        setActiveIndex(Math.max(0, index - 1));
    };

    return (
        <section className="py-24 bg-brand-dark">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-brand-primary font-semibold tracking-wide uppercase text-sm">Interactive Tool</span>
                    <h2 className="text-4xl font-bold text-white mt-2 mb-4">Smart Banner Generator</h2>
                    <p className="text-lg text-gray-400">
                        Create a rotating announcement bar. Preview how it loops on your store.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Controls */}
                    <div className="w-full lg:w-1/3 space-y-6 bg-brand-surface p-8 rounded-2xl border border-white/10">

                        {/* Slide Switcher */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {banners.map((banner, idx) => (
                                <button
                                    key={banner.id}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${activeIndex === idx
                                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                                        : 'bg-white text-gray-500 border border-gray-200'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={addBanner}
                                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <h3 className="font-semibold text-gray-900">Editing Slide {activeIndex + 1}</h3>
                            {banners.length > 1 && (
                                <button onClick={() => removeBanner(activeIndex)} className="text-red-500 hover:text-red-700 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Type className="w-4 h-4" /> Banner Text
                            </label>
                            <input
                                type="text"
                                value={banners[activeIndex].text}
                                onChange={(e) => updateBanner('text', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Palette className="w-4 h-4" /> Background
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={banners[activeIndex].bgColor}
                                        onChange={(e) => updateBanner('bgColor', e.target.value)}
                                        className="h-10 w-full cursor-pointer rounded-lg border border-gray-600 p-1 bg-brand-dark"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Layout className="w-4 h-4" /> Text Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={banners[activeIndex].textColor}
                                        onChange={(e) => updateBanner('textColor', e.target.value)}
                                        className="h-10 w-full cursor-pointer rounded-lg border border-gray-200 p-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied code for Slide " + (activeIndex + 1) : "Copy HTML Code"}
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-gray-900 rounded-t-2xl p-4 flex items-center gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-4 flex-1 bg-gray-800 h-6 rounded-md text-xs text-gray-400 flex items-center px-3">
                                your-shopify-store.com
                            </div>
                        </div>

                        <div className="border-x border-b border-gray-200 rounded-b-2xl h-[400px] relative overflow-hidden bg-white group">
                            {/* The Rotating Banner (Preview) */}
                            <div className="relative">
                                {banners.map((banner, idx) => (
                                    <div
                                        key={banner.id}
                                        style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
                                        className={`absolute top-0 w-full p-3 text-center font-medium transition-all duration-500 transform ${idx === previewIndex ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                                            }`}
                                    >
                                        {banner.text}
                                    </div>
                                ))}
                                {/* Placeholder height */}
                                <div className="p-3 opacity-0 pointer-events-none">Placeholder</div>
                            </div>

                            {/* Manual Controls for Preview (Next Next) */}
                            <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setPreviewIndex((prev) => (prev - 1 + banners.length) % banners.length)} className="p-1 bg-white/20 hover:bg-white/40 text-white rounded">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => setPreviewIndex((prev) => (prev + 1) % banners.length)} className="p-1 bg-white/20 hover:bg-white/40 text-white rounded">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>


                            {/* Fake Store Content */}
                            <div className="p-8 opacity-50 pointer-events-none select-none">
                                <div className="flex justify-between items-center mb-12">
                                    <div className="w-32 h-8 bg-gray-200 rounded"></div>
                                    <div className="flex gap-4">
                                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <div className="w-1/2 h-64 bg-gray-100 rounded-xl"></div>
                                    <div className="w-1/2 space-y-4">
                                        <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
                                        <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
                                        <div className="w-full h-32 bg-gray-100 rounded"></div>
                                        <div className="w-32 h-10 bg-black rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-center gap-2">
                            {banners.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-colors ${idx === previewIndex ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
