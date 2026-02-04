export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05050A] text-white">
            <div className="flex flex-col items-center gap-6">
                {/* Logo Animation */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-brand-primary/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white">
                        S
                    </div>
                </div>

                <div className="text-gray-400 font-medium animate-pulse">
                    Loading Experience...
                </div>
            </div>
        </div>
    );
}
