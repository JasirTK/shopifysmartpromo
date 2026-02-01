"use client";

import { motion } from 'framer-motion';
import { Workflow, CreditCard, Code, Globe, CheckCircle2 } from 'lucide-react';

const icons = {
    Workflow: Workflow,
    CreditCard: CreditCard,
    Code: Code,
    Globe: Globe,
};

export default function ShopifyIntegrationSection({ content }: { content: any }) {
    if (!content) return null;

    return (
        <section className="py-24 bg-[#05050A] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Official Partner
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        {content.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400"
                    >
                        {content.subtitle}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.features.map((feature: any, index: number) => {
                        const isUrl = feature.icon?.includes('/') || feature.icon?.includes('http');
                        const Icon = icons[feature.icon as keyof typeof icons] || Code;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform duration-300 overflow-hidden relative">
                                    {isUrl ? (
                                        <img src={feature.icon} alt={feature.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon className="w-6 h-6" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
