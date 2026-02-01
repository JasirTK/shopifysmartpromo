"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Copy, Check, Eye, Layout, Monitor, Zap, Type, Clock, Box, Layers, MoveVertical, Store } from 'lucide-react';

type Slide = {
    id: string;
    text: string;
    bgColor: string;
    textColor: string;
};

export default function BannerGenerator() {
    const [slides, setSlides] = useState<Slide[]>([
        { id: '1', text: '🎉 Summer Sale: Get 20% OFF everything!', bgColor: '#6366f1', textColor: '#ffffff' }
    ]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [copied, setCopied] = useState(false);

    // Banner Design Controls
    const [fontSize, setFontSize] = useState(14);
    const [speed, setSpeed] = useState(3000);
    const [padding, setPadding] = useState(12);
    const [radius, setRadius] = useState(0);
    const [shadow, setShadow] = useState('none');
    const [maxWidth, setMaxWidth] = useState('100%');

    // Hero Simulation Controls
    const [heroTitle, setHeroTitle] = useState('New Arrivals');
    const [heroSubtitle, setHeroSubtitle] = useState('Explore our latest collection of premium goods.');
    const [heroBg, setHeroBg] = useState('#1a1b26'); // Dark theme default
    const [heroBtnColor, setHeroBtnColor] = useState('#ffffff');
    const [heroBtnTextColor, setHeroBtnTextColor] = useState('#000000');

    const activeSlide = slides[activeIdx];

    const addSlide = () => {
        if (slides.length >= 5) return;
        const newSlide = {
            id: Math.random().toString(36).substr(2, 9),
            text: 'New Announcement...',
            bgColor: '#10b981',
            textColor: '#ffffff'
        };
        setSlides([...slides, newSlide]);
        setActiveIdx(slides.length);
    };

    const removeSlide = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (slides.length === 1) return;
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
        setActiveIdx(Math.max(0, index - 1));
    };

    const updateSlide = (key: keyof Slide, value: string) => {
        const newSlides = [...slides];
        newSlides[activeIdx] = { ...newSlides[activeIdx], [key]: value };
        setSlides(newSlides);
    };

    const getShadowCSS = (s: string) => {
        if (s === 'soft') return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        if (s === 'hard') return '4px 4px 0px 0px rgba(0,0,0,1)';
        return 'none';
    };

    const generateHTML = () => {
        const shadowCSS = getShadowCSS(shadow);
        return `
<!-- Smart Promo Banner -->
<div id="smart-banner-root" style="font-family: system-ui, -apple-system, sans-serif; width: 100%; display: flex; justify-content: center;"></div>
<script>
  (function() {
    const slides = ${JSON.stringify(slides.map(s => ({ text: s.text, bg: s.bgColor, color: s.textColor })))};
    const speed = ${speed};
    const fontSize = "${fontSize}px";
    const padding = "${padding}px";
    const radius = "${radius}px";
    const shadow = "${shadowCSS}";
    const maxWidth = "${maxWidth}";
    
    let idx = 0;
    const root = document.getElementById('smart-banner-root');
    
    function render() {
      const s = slides[idx];
      const inner = '<div style="background:'+s.bg+';color:'+s.color+';padding:'+padding+';border-radius:'+radius+';box-shadow:'+shadow+';width:100%;max-width:'+maxWidth+';text-align:center;transition:all 0.5s ease;font-weight:600;font-size:'+fontSize+';margin: 0 auto;">'+s.text+'</div>';
      root.innerHTML = inner;
      idx = (idx + 1) % slides.length;
    }
    render();
    if(slides.length > 1) setInterval(render, speed);
  })();
</script>
`.trim();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateHTML());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="tools" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-brand-primary font-bold tracking-wide uppercase text-sm mb-3">Interactive Tool</h2>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Smart Banner & Store Simulator
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Design your announcement bar and visualize it on a simulated version of your store.
                    </p>
                </div>

                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Editor Panel */}
                    <div className="lg:col-span-5 bg-[#0A0A0F]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl max-h-[800px] overflow-y-auto scrollbar-hide">

                        {/* Slide Tabs */}
                        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIdx(i)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all relative group ${activeIdx === i
                                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25 scale-110'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                    {slides.length > 1 && activeIdx === i && (
                                        <span
                                            onClick={(e) => removeSlide(e, i)}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600"
                                        >
                                            <Trash2 className="w-2.5 h-2.5 text-white" />
                                        </span>
                                    )}
                                </button>
                            ))}
                            {slides.length < 5 && (
                                <button
                                    onClick={addSlide}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-gray-400 hover:bg-white/10 border border-dashed border-white/20 hover:border-white/40 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">

                            {/* Slide Content */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Slide Content
                                </label>
                                <input
                                    type="text"
                                    value={activeSlide.text}
                                    onChange={(e) => updateSlide('text', e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                                    placeholder="Enter announcement..."
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs text-gray-400">Background</label>
                                        <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-1.5 pr-3">
                                            <input type="color" value={activeSlide.bgColor} onChange={(e) => updateSlide('bgColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                            <span className="text-[10px] font-mono text-gray-400 opacity-60">{activeSlide.bgColor}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs text-gray-400">Text Color</label>
                                        <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-1.5 pr-3">
                                            <input type="color" value={activeSlide.textColor} onChange={(e) => updateSlide('textColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                            <span className="text-[10px] font-mono text-gray-400 opacity-60">{activeSlide.textColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Store Context (NEW) */}
                            <div className="bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/20 space-y-4">
                                <label className="text-xs font-semibold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                                    <Store className="w-3 h-3" /> Store Preview Context
                                </label>
                                <p className="text-[10px] text-gray-400 mb-2">Adjust the hero section below to match your store's vibe.</p>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Hero Title</label>
                                        <input
                                            type="text"
                                            value={heroTitle}
                                            onChange={(e) => setHeroTitle(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-brand-primary/50"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Hero Background</label>
                                            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-1 pr-2">
                                                <input type="color" value={heroBg} onChange={(e) => setHeroBg(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                                <span className="text-[10px] font-mono text-gray-400 opacity-60">{heroBg}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Button Color</label>
                                            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-1 pr-2">
                                                <input type="color" value={heroBtnColor} onChange={(e) => setHeroBtnColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                                <span className="text-[10px] font-mono text-gray-400 opacity-60">{heroBtnColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Banner Design */}
                            <div>
                                <label className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1 uppercase tracking-wider">
                                    <Layout className="w-3 h-3" /> Banner Design
                                </label>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Banner Height</label>
                                            <input type="range" min="8" max="24" value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Corner Radius</label>
                                            <input type="range" min="0" max="20" value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleCopy}
                                    className="w-full py-4 bg-brand-surface border border-brand-primary/30 text-brand-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-all group"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Code Copied!' : 'Copy HTML Code'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                <Monitor className="w-5 h-5 text-gray-400" />
                                Live Preview
                            </h3>
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
                                <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
                                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
                            </div>
                        </div>

                        <div className="bg-[#1a1b26] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
                            {/* Mock Browser Header */}
                            <div className="bg-[#0f0f13] p-3 flex items-center gap-4 border-b border-white/5 shrink-0">
                                <div className="flex gap-1.5 opacity-50">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded-md h-6 flex items-center px-3 text-[10px] text-gray-500 font-mono">
                                    my-awesome-shop.com
                                </div>
                            </div>

                            {/* Simulation - The Banner (Centered container) */}
                            <div className="w-full flex justify-center bg-white/5 relative z-10 border-b border-white/5">
                                <motion.div
                                    key={activeSlide.id + shadow + radius + padding + maxWidth}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        backgroundColor: activeSlide.bgColor,
                                        color: activeSlide.textColor,
                                        fontSize: `${fontSize}px`,
                                        padding: `${padding}px`,
                                        borderRadius: `${radius}px`,
                                        boxShadow: getShadowCSS(shadow),
                                        width: '100%',
                                        maxWidth: maxWidth === '100%' ? '100%' : maxWidth,
                                    }}
                                    className="text-center font-semibold relative"
                                >
                                    {activeSlide.text}
                                </motion.div>
                            </div>

                            {/* Live Store Content Simulation */}
                            <div
                                className="p-12 flex-1 flex flex-col items-center justify-center text-center space-y-6 transition-colors duration-500 relative overflow-hidden"
                                style={{ backgroundColor: heroBg }}
                            >
                                {/* Abstract Background shapes */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white mix-blend-overlay blur-3xl"></div>
                                    <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white mix-blend-overlay blur-3xl"></div>
                                </div>

                                {/* Simulated Logo & Nav (Static) */}
                                <div className="absolute top-6 left-8 flex items-center gap-8 w-full opacity-50">
                                    <div className="w-8 h-8 rounded bg-white/20"></div>
                                    <div className="flex gap-4">
                                        <div className="w-16 h-3 rounded-full bg-white/20"></div>
                                        <div className="w-16 h-3 rounded-full bg-white/20"></div>
                                        <div className="w-16 h-3 rounded-full bg-white/20"></div>
                                    </div>
                                </div>

                                <motion.div
                                    className="relative z-10 max-w-lg"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={heroTitle}
                                >
                                    <h1 className="text-3xl font-bold mb-4" style={{ color: heroBtnTextColor === '#000000' ? '#ffffff' : '#000000' }}>
                                        {heroTitle}
                                    </h1>
                                    <p className="text-sm opacity-80 mb-8" style={{ color: heroBtnTextColor === '#000000' ? '#ffffff' : '#000000' }}>
                                        {heroSubtitle}
                                    </p>
                                    <button
                                        className="px-6 py-3 rounded-full font-semibold text-sm shadow-xl hover:scale-105 transition-transform"
                                        style={{ backgroundColor: heroBtnColor, color: heroBtnTextColor }}
                                    >
                                        Shop Now
                                    </button>
                                </motion.div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Note: The "Store" section above is just for preview. Only the top banner code is generated.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
