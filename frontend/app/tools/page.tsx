import BannerGenerator from '@/components/tools/BannerGenerator';

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-[#05050A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[url('/grid-pattern.svg')] bg-fixed">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

                    <h2 className="text-brand-primary font-bold tracking-wide uppercase text-sm mb-3">Interactive Tool</h2>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Smart Banner Generator
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Create a rotating announcement bar to highlight free shipping, sales, or discount codes.
                        Preview how it loops on your store.
                    </p>
                </div>

                <BannerGenerator />
            </div>
        </div>
    );
}
