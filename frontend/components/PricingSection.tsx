import { Check, Info } from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    cta_url?: string; // New
    highlight?: boolean;
}

interface PricingProps {
    content: {
        title: string;
        subtitle: string;
        plans: PricingPlan[];
    };
}

export default function PricingSection({ content }: PricingProps) {
    if (!content) return null;

    return (
        <section id="pricing" className="py-24 bg-[#05050A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-brand-primary font-semibold tracking-wide uppercase text-sm">Transparent Pricing</span>
                    <h2 className="text-4xl font-bold text-white mt-2 mb-4">{content.title}</h2>
                    <p className="text-lg text-gray-400">{content.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {content.plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 group ${plan.highlight
                                ? 'bg-brand-surface border-brand-primary shadow-2xl shadow-brand-primary/20 scale-105 z-10'
                                : 'bg-brand-surface/40 border-white/5 hover:border-white/10 hover:bg-brand-surface/60'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500 text-sm">/{plan.period}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-brand-primary' : 'text-gray-500'}`} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={plan.cta_url || "#"}
                                className={`w-full py-3.5 rounded-xl font-bold transition-all block text-center ${plan.highlight
                                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25'
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="text-center text-gray-500 text-sm mt-12">
                    All plans include a 14-day free trial. No credit card required.
                </p>
            </div>
        </section>
    );
}
