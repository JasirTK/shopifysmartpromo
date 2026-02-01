import { LayoutDashboard, Layers, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
    activeSection: string;
    sections: any[];
    onSelect: (key: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ activeSection, sections, onSelect, isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-brand-surface text-white shadow-2xl border-r border-white/5
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold">S</div>
                        <span className="text-lg font-bold tracking-tight">Admin Console</span>
                    </div>
                    {/* Close Button for Mobile */}
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Content Sections</div>

                    {sections.map((section) => (
                        <button
                            key={section.key}
                            onClick={() => {
                                onSelect(section.key);
                                onClose(); // Close sidebar on mobile selection
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === section.key
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span className="capitalize">{section.key.replace(/_/g, ' ')}</span>
                        </button>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-800 space-y-2 bg-brand-surface">
                    <button
                        onClick={() => {
                            document.cookie = 'admin_token=; Max-Age=0; path=/;'; // Simple cookie clear
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>
        </>
    );
}
