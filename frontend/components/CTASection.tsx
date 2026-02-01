import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CTAProps {
    content: {
        title: string;
        subtitle: string;
        cta_main: string;
        cta_main_url?: string;
        cta_sub: string;
    };
}

export default function CTASection({ content }: CTAProps) {
    if (!content) return null;

    return (
        <section className="py-20 bg-brand-surface relative overflow-hidden text-white">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px]"></div>

            <div className="container mx-auto px-6 relative z-10 text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    {content.title}
                </h2>
                <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
                    {content.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href={content.cta_main_url || "#"} className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
                        {content.cta_main}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <span className="text-sm text-indigo-300 font-medium tracking-wide uppercase">
                        {content.cta_sub}
                    </span>
                </div>
            </div>
        </section>
    );
}
