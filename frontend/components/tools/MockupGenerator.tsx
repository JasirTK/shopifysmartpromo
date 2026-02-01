"use client";

import { useState, useRef } from 'react';
import { Download, Type, Palette, LayoutTemplate, Sparkles, Grid, Layers, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';

type Theme = 'deep-space' | 'aurora' | 'neon-glass' | 'cyber-grid';
type Overlay = 'none' | 'noise' | 'grid' | 'dots';

export default function AssetStudio() {
    const [title, setTitle] = useState('SUMMER SALE');
    const [subtitle, setSubtitle] = useState('UP TO 50% OFF');
    const [accentColor, setAccentColor] = useState('#6366f1');
    const [theme, setTheme] = useState<Theme>('deep-space');
    const [overlay, setOverlay] = useState<Overlay>('noise');
    const [isExporting, setIsExporting] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);

    const downloadImage = async () => {
        if (canvasRef.current) {
            setIsExporting(true);
            try {
                // Wait for state updates or fonts if needed
                await new Promise(resolve => setTimeout(resolve, 100));

                const dataUrl = await toPng(canvasRef.current, {
                    cacheBust: true,
                    pixelRatio: 3,
                    style: {
                        transform: 'none', // Reset transform for clean export
                    }
                });

                const link = document.createElement('a');
                link.download = `smart-promo-${theme}-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Failed to download image', err);
            } finally {
                setIsExporting(false);
            }
        }
    };

    // Theme Configurations
    const getThemeStyles = () => {
        switch (theme) {
            case 'aurora':
                return {
                    container: `bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900`,
                    card: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    },
                    text: 'text-white drop-shadow-lg'
                };
            case 'neon-glass':
                return {
                    container: 'bg-[#050505]',
                    card: {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${accentColor}`,
                        boxShadow: `0 0 20px ${accentColor}40, inset 0 0 20px ${accentColor}10`,
                    },
                    text: 'text-white'
                };
            case 'cyber-grid':
                return {
                    container: 'bg-black',
                    card: {
                        background: `${accentColor}10`,
                        border: `2px solid ${accentColor}`,
                        boxShadow: 'none',
                    },
                    text: `text-[${accentColor}] font-mono` // Dynamic class usage in template literal might be tricky, handled inline below
                };
            case 'deep-space':
            default:
                return {
                    container: 'bg-[#0A0A0F]',
                    card: {
                        background: 'linear-gradient(180deg, rgba(20, 20, 30, 0.6) 0%, rgba(10, 10, 15, 0.8) 100%)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    },
                    text: 'text-gray-100'
                };
        }
    };

    const styles = getThemeStyles();

    return (
        <section id="tools" className="py-24 relative overflow-hidden bg-[#0A0A0F] min-h-screen">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-brand-primary/20">
                        New Engine
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Premium Asset Studio
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Design high-conversion social assets in seconds. <br />
                        Holographic gradients, glassmorphism, and neon effects.
                    </p>
                </div>

                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Controls Panel */}
                    <div className="lg:col-span-4 bg-[#111116] border border-white/5 rounded-3xl p-6 flex flex-col gap-8 shadow-2xl">

                        {/* INPUTS */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <Type className="w-4 h-4" /> Content
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-all font-bold text-lg"
                                    placeholder="Main Headline"
                                />
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-primary transition-all text-sm"
                                    placeholder="Subtitle / Code"
                                />
                            </div>
                        </div>

                        {/* THEMES */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <LayoutTemplate className="w-4 h-4" /> Theme Preset
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['deep-space', 'aurora', 'neon-glass', 'cyber-grid'] as Theme[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`p-3 rounded-lg text-xs font-semibold capitalize border transition-all text-left flex items-center gap-2
                                            ${theme === t
                                                ? 'bg-white/10 text-white border-brand-primary shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]'
                                                : 'bg-black/20 text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${t === theme ? 'bg-brand-primary' : 'bg-gray-600'}`} />
                                        {t.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* OVERLAYS & COLOR */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                    <Layers className="w-4 h-4" /> Texture
                                </label>
                                <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                                    {(['none', 'noise', 'grid'] as Overlay[]).map((o) => (
                                        <button
                                            key={o}
                                            onClick={() => setOverlay(o)}
                                            className={`flex-1 flex items-center justify-center py-2 rounded-md transition-all ${overlay === o ? 'bg-white/10 text-white shadow-sm' : 'text-gray-600 hover:text-gray-400'}`}
                                            title={o}
                                        >
                                            {o === 'none' && <div className="w-3 h-3 rounded border border-current" />}
                                            {o === 'noise' && <Sparkles className="w-3 h-3" />}
                                            {o === 'grid' && <Grid className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                                    <Palette className="w-4 h-4" /> Accent
                                </label>
                                <div className="h-[42px] relative flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-2 cursor-pointer hover:border-white/20 transition-colors">
                                    <input
                                        type="color"
                                        value={accentColor}
                                        onChange={(e) => setAccentColor(e.target.value)}
                                        className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                                    />
                                    <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: accentColor }} />
                                    <span className="text-xs font-mono text-gray-400 uppercase">{accentColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* EXPORT */}
                        <div className="mt-auto pt-6 border-t border-white/5">
                            <button
                                onClick={downloadImage}
                                disabled={isExporting}
                                className="w-full py-4 bg-brand-primary hover:bg-brand-primary-light text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isExporting ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                )}
                                {isExporting ? 'Rendering...' : 'Download Asset'}
                            </button>
                        </div>
                    </div>

                    {/* PREVIEW CANVAS */}
                    <div className="lg:col-span-8 flex items-center justify-center min-h-[600px] bg-[#111116] rounded-3xl border border-white/5 relative overflow-hidden">

                        {/* Background Grid Pattern for Editor Context */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <div
                            ref={canvasRef}
                            className={`relative w-[600px] h-[400px] shrink-0 overflow-hidden flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${styles.container}`}
                        >
                            {/* Aurora Blurs (Conditional) */}
                            {theme === 'aurora' && (
                                <>
                                    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-500/30 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
                                    <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-500/30 blur-[100px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
                                </>
                            )}

                            {/* Neon Glow (Conditional) */}
                            {theme === 'neon-glass' && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5"></div>
                            )}

                            {/* Overlays */}
                            {overlay === 'noise' && (
                                <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                            )}
                            {overlay === 'grid' && (
                                <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                            )}

                            {/* MAIN CARD CONTENT */}
                            <div
                                className="relative z-10 p-12 rounded-2xl flex flex-col items-center text-center max-w-[80%]"
                                style={styles.card}
                            >
                                {/* Decorative Icon */}
                                <div
                                    className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center shadow-lg"
                                    style={{ background: accentColor }}
                                >
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>

                                <h2
                                    className={`text-5xl font-black tracking-tight mb-4 ${styles.text}`}
                                    style={{ color: theme === 'cyber-grid' ? accentColor : undefined }}
                                >
                                    {title}
                                </h2>

                                <div className={`px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md`}>
                                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/80">
                                        {subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Watermark / Brand Footer */}
                            <div className="absolute bottom-6 flex items-center gap-2 opacity-40">
                                <div className="w-4 h-4 rounded-full bg-white/20"></div>
                                <span className="text-[10px] font-medium tracking-widest text-white uppercase">Designed with Smart Promo</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
