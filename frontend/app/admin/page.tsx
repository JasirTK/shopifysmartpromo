"use client";

import { useEffect, useState, useLayoutEffect } from 'react';
import { getAllContent, updateContent } from '@/lib/api';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DynamicEditor from '@/components/admin/DynamicEditor';
import { Save, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    // Buffer used for editing so we don't mutate state directly until saved
    const [editBuffer, setEditBuffer] = useState<any>(null);

    useLayoutEffect(() => {
        const token = Cookies.get('admin_token');
        if (!token) {
            router.push('/login');
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, []);

    useEffect(() => {
        if (selectedKey && sections.length > 0) {
            const section = sections.find(s => s.key === selectedKey);
            if (section) {
                setEditBuffer(JSON.parse(JSON.stringify(section.content))); // Deep copy
            }
        }
    }, [selectedKey, sections]);

    const fetchContent = async () => {
        const SECTION_ORDER = ['hero', 'features', 'how_it_works', 'shopify_integration', 'pricing', 'testimonials', 'cta_bottom', 'seo'];

        const data = await getAllContent();
        const sorted = data.sort((a: any, b: any) => {
            const indexA = SECTION_ORDER.indexOf(a.key);
            const indexB = SECTION_ORDER.indexOf(b.key);
            // If both found in order list, sort by index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If one not found, put it at the end
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return 0;
        });
        setSections(sorted);
        if (!selectedKey && sorted.length > 0) {
            setSelectedKey(sorted[0].key);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!selectedKey || !editBuffer) return;

        setSaving(true);
        try {
            await updateContent(selectedKey, editBuffer);
            // Update local sections state
            setSections(prev => prev.map(s => s.key === selectedKey ? { ...s, content: editBuffer, last_updated: new Date().toISOString() } : s));

            setSuccessMsg("Changes saved successfully!");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (e) {
            alert('Failed to save content.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 text-indigo-600">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="font-semibold">Loading Admin Console...</span>
                </div>
            </div>
        );
    }

    const activeSectionMeta = sections.find(s => s.key === selectedKey);

    return (
        <div className="min-h-screen bg-[#05050A] font-sans flex text-white bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/5 blur-[120px]"></div>
            </div>

            <AdminSidebar
                activeSection={selectedKey || ''}
                sections={sections}
                onSelect={setSelectedKey}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 w-full md:ml-64 relative z-10 duration-300">
                {/* Header */}
                <header className="bg-brand-dark/80 backdrop-blur-md h-20 border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 capitalize truncate max-w-[150px] md:max-w-none">
                                {selectedKey?.replace(/_/g, ' ')}
                            </h1>
                            {activeSectionMeta && (
                                <span className="hidden md:inline-block px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-gray-400 rounded-full">
                                    Last edited: {new Date(activeSectionMeta.last_updated).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Link href="/" target="_blank" className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">
                            <ExternalLink className="w-4 h-4" /> View Site
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg shadow-brand-primary/25 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 text-sm md:text-base"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {successMsg && (
                        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-fade-in-up">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">{successMsg}</span>
                        </div>
                    )}

                    <div className="bg-brand-surface/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
                        <div className="p-4 md:p-8">
                            {editBuffer ? (
                                <div className="max-w-4xl mx-auto">
                                    <DynamicEditor
                                        data={editBuffer}
                                        onChange={setEditBuffer}
                                        sectionName={selectedKey || undefined}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-20 text-gray-500">Select a section to edit</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
