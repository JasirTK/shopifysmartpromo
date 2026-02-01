"use client";

import { BarChart3, Tag, MessageCircle, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureItem {
    title: string;
    desc: string;
    icon: string;
}

interface FeaturesProps {
    content: {
        title: string;
        items: FeatureItem[];
    };
}

const iconMap: any = {
    BarChart3: <BarChart3 className="w-6 h-6" />,
    Tag: <Tag className="w-6 h-6" />,
    MessageCircle: <MessageCircle className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
    Target: <Target className="w-6 h-6" />,
    TrendingUp: <TrendingUp className="w-6 h-6" />
};

export default function FeaturesSection({ content }: FeaturesProps) {
    if (!content) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section id="features" className="py-24 bg-brand-dark">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-brand-primary font-semibold tracking-wide uppercase text-sm">Features</span>
                    <h2 className="text-4xl font-bold text-white mt-2 mb-4">{content.title}</h2>
                    <p className="text-lg text-gray-400">Powerful tools designed to skyrocket your sales and engagement.</p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {content.items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-brand-surface hover:bg-brand-surface/80 transition-colors border border-white/5 shadow-sm hover:shadow-xl group relative overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 overflow-hidden ${idx % 2 === 0 ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-secondary/20 text-brand-secondary'
                                        }`}
                                >
                                    {(item.icon.includes('/') || item.icon.includes('http')) ? (
                                        <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        iconMap[item.icon] || <Zap className="w-6 h-6" />
                                    )}
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
