interface TestimonialItem {
    name: string;
    role: string;
    quote: string;
    avatar: string;
}

interface TestimonialsProps {
    content: {
        title: string;
        items: TestimonialItem[];
    };
}

export default function TestimonialsSection({ content }: TestimonialsProps) {
    if (!content) return null;

    return (
        <section className="py-24 bg-brand-dark border-t border-white/5">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-white mb-16">{content.title}</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {content.items.map((item, idx) => (
                        <div key={idx} className="bg-brand-surface rounded-2xl p-8 relative border border-white/5">
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-8 text-6xl text-brand-primary/20 font-serif leading-none">"</div>

                            <p className="text-gray-300 italic text-lg mb-8 relative z-10 leading-relaxed">
                                {item.quote}
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={item.avatar}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-full border-2 border-brand-primary shadow-sm"
                                />
                                <div>
                                    <h4 className="font-bold text-white">{item.name}</h4>
                                    <p className="text-sm text-gray-400">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
