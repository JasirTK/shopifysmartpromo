
interface Step {
    step: number;
    title: string;
    desc: string;
}

interface HowItWorksProps {
    content: {
        title: string;
        steps: Step[];
    };
}

export default function HowItWorksSection({ content }: HowItWorksProps) {
    if (!content) return null;

    return (
        <section id="how-it-works" className="py-24 bg-brand-surface text-white relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-brand-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-secondary rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl font-bold text-center mb-16">{content.title}</h2>

                <div className="flex flex-col md:flex-row justify-center gap-12 items-start">
                    {content.steps.map((item, idx) => (
                        <div key={idx} className="flex-1 text-center relative max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg border-4 border-brand-primary text-brand-primary">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {item.desc}
                            </p>

                            {/* Connector Line (hidden on mobile) */}
                            {idx !== content.steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-white/10 -z-10 translate-x-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
