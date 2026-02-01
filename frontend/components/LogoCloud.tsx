export default function LogoCloud() {
    const logos = [
        { name: "Shopify Plus", opacity: "opacity-60" },
        { name: "Klaviyo", opacity: "opacity-50" },
        { name: "Recharge", opacity: "opacity-60" },
        { name: "Yotpo", opacity: "opacity-50" },
        { name: "Gorgias", opacity: "opacity-60" },
    ];

    return (
        <section className="py-12 border-b border-white/5 bg-brand-surface/50">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">Trusted by 10,000+ scaling brands</p>

                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-green-400 transition-colors">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M22.032 6.777c.307-.488.13-1.042-.294-1.28l-4.463-2.51c-.606-.34-1.472-.116-1.928.498l-7.777 10.435-5.586-4.148c-.61-.453-1.4-.293-1.787.327L.25 10.057c-.43.69-.165 1.7.53 2.11L11.5 19.5c.67.395 1.56.242 2.05-.33l8.482-12.393z" /></svg>
                        Shopify Plus
                    </div>
                    <div className="flex items-center gap-2 text-xl font-bold text-white">Klaviyo</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-white">Recharge</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-white">Yotpo</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-white">Gorgias</div>
                </div>
            </div>
        </section>
    );
}
