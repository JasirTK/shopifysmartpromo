import { Trash2, Plus, GripVertical, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';

interface DynamicEditorProps {
    data: any;
    onChange: (newData: any) => void;
    sectionName?: string; // NEW: To identify context for templates
}

// Default templates for new items when array is empty
const TEMPLATES: Record<string, Record<string, any>> = {
    hero: {
        slides: { title: "New Slide", subtitle: "Subtitle", cta_primary: "Button", cta_secondary: "Button", style: "light-mode", image_url: "" }
    },
    features: {
        items: { title: "New Feature", desc: "Description", icon: "Star" }
    },
    how_it_works: {
        steps: { step: 1, title: "New Step", desc: "Description" }
    },
    testimonials: {
        items: { name: "New User", role: "Role", quote: "Quote", avatar: "" }
    }
};

export default function DynamicEditor({ data, onChange, sectionName }: DynamicEditorProps) {
    if (typeof data !== 'object' || data === null) {
        return <div className="text-red-500">Invalid Data</div>;
    }

    const handleChange = (key: string, value: any) => {
        onChange({ ...data, [key]: value });
    };

    const renderInput = (key: string, value: any) => {
        // PRIORITY 1: Image URL detection (Check this FIRST)
        if (key.includes('image') || key.includes('avatar') || key.includes('src') || key.includes('icon')) {
            return (
                <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                    <div className="space-y-3">
                        {/* URL Input */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                            <div className="flex-1 relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    placeholder="https://... or upload file"
                                    className="w-full pl-10 p-2 bg-brand-dark border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-primary text-white placeholder-gray-500"
                                />
                            </div>

                            {/* File Upload */}
                            <label className="cursor-pointer bg-brand-surface border border-white/10 hover:bg-white/5 text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Upload className="w-4 h-4" />
                                <span>{value ? 'Change' : 'Upload'}</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const { uploadImage } = await import('@/lib/api');
                                            const res = await uploadImage(file);
                                            if (res && res.url) {
                                                handleChange(key, res.url);
                                            }
                                        }
                                    }}
                                />
                            </label>

                            {/* Delete Button - Only show if value exists */}
                            {value && (
                                <button
                                    onClick={() => handleChange(key, "")}
                                    title="Remove Image"
                                    className="bg-brand-surface border border-red-900/30 hover:bg-red-900/20 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>

                        {/* Preview */}
                        {value && (
                            <div className="relative w-full h-64 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center group">
                                <img
                                    src={value}
                                    alt="Preview"
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Load+Error';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="bg-black/75 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        Live Preview
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // PRIORITY 2: Long text detection
        if (typeof value === 'string' && value.length > 50) {
            return (
                <div key={key} className="mb-4">
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
                    <textarea
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="w-full p-3 bg-brand-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary min-h-[100px] text-white placeholder-gray-600 transition-all duration-300 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] outline-none resize-y"
                    />
                </div>
            );
        }

        return (
            <div key={key} className="mb-4">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full p-3 bg-brand-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-white placeholder-gray-600 transition-all duration-300 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] outline-none"
                />
            </div>
        );
    };

    const renderArray = (key: string, array: any[]) => {
        const addItem = () => {
            let template: any = {};

            // 1. Try to clone existing item if array has items
            if (array.length > 0) {
                const firstItem = array[0];
                if (typeof firstItem === 'object' && firstItem !== null) {
                    template = { ...firstItem };
                    // Clear values in template
                    Object.keys(template).forEach(k => template[k] = "");
                } else {
                    template = "";
                }
            }
            // 2. If array is empty, try to find a predefined template
            else if (sectionName && TEMPLATES[sectionName] && TEMPLATES[sectionName][key]) {
                template = { ...TEMPLATES[sectionName][key] };
            }
            // 3. Fallback
            else {
                // Check if we should default to a string (if key implies a list of strings like 'features')
                if (key === 'features' || key === 'items' || key === 'list') {
                    template = "New Item";
                } else {
                    template = { title: "New Item", description: "" };
                }
            }

            handleChange(key, [...array, template]);
        };

        const removeItem = (idx: number) => {
            const newArray = [...array];
            newArray.splice(idx, 1);
            handleChange(key, newArray);
        };

        const updateItem = (idx: number, updatedItem: any) => {
            const newArray = [...array];
            newArray[idx] = updatedItem;
            handleChange(key, newArray);
        };

        return (
            <div key={key} className="mb-8 bg-brand-surface/30 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-inner">
                <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                    <label className="block text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
                        {key.replace(/_/g, ' ')}
                        <span className="text-xs font-normal text-gray-500 bg-black/20 px-2 py-0.5 rounded-full ml-1">{array.length} items</span>
                    </label>
                    <button onClick={addItem} className="text-xs flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/50 hover:bg-brand-primary hover:text-white text-brand-primary px-3 py-1.5 rounded-lg transition-all duration-300 font-medium">
                        <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                </div>

                <div className="space-y-4">
                    {array.map((item, idx) => (
                        <div key={idx} className="bg-[#0A0A0F] p-4 rounded-xl border border-white/5 hover:border-brand-primary/30 transition-colors group relative shadow-lg flex gap-3 items-start">
                            <div className="flex-1">
                                {typeof item === 'object' && item !== null ? (
                                    <DynamicEditor data={item} onChange={(newData) => updateItem(idx, newData)} sectionName={sectionName} />
                                ) : (
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateItem(idx, e.target.value)}
                                        className="w-full p-3 bg-brand-dark/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary text-white placeholder-gray-600 outline-none"
                                        placeholder={`Item ${idx + 1}`}
                                    />
                                )}
                            </div>

                            <button onClick={() => removeItem(idx)} className="mt-2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Sort keys: Title -> Subtitle -> Description -> Others -> Arrays
    const sortedKeys = Object.entries(data).sort(([keyA, valueA], [keyB, valueB]) => {
        const getPriority = (key: string, value: any) => {
            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return 100; // Complex items last

            const lowerKey = key.toLowerCase();
            if (lowerKey === 'title' || lowerKey === 'name' || lowerKey === 'heading') return 1;
            if (lowerKey === 'subtitle' || lowerKey === 'subject' || lowerKey === 'role' || lowerKey === 'price') return 2;
            if (lowerKey === 'description' || lowerKey === 'desc' || lowerKey === 'quote' || lowerKey === 'content') return 3;
            if (lowerKey.includes('image') || lowerKey.includes('icon') || lowerKey.includes('avatar')) return 4;

            return 10; // Other scalars
        };

        const priorityA = getPriority(keyA, valueA);
        const priorityB = getPriority(keyB, valueB);

        if (priorityA !== priorityB) return priorityA - priorityB;
        return 0; // Keep original order if priority is same
    });

    // Track keys that have been rendered to avoid duplicates when grouping
    const renderedKeys = new Set<string>();

    return (
        <div className="space-y-2">
            {sortedKeys.map(([key, value]) => {
                if (renderedKeys.has(key)) return null;

                // SPECIAL GROUPING: Button Name + Button URL
                // Check if this is a "button" like key and if it has a corresponding _url field
                const urlKey = `${key}_url`;
                if (Object.prototype.hasOwnProperty.call(data, urlKey)) {
                    // Mark both keys as rendered
                    renderedKeys.add(key);
                    renderedKeys.add(urlKey);

                    const urlValue = data[urlKey];

                    return (
                        <div key={key} className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
                            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <span className="bg-brand-primary/20 text-brand-primary p-1 rounded">CTA</span>
                                {key.replace(/_/g, ' ')}
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Button Text Input */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5">Button Text</label>
                                    <input
                                        type="text"
                                        value={value as string || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full p-2.5 bg-brand-dark/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-primary/50 text-white placeholder-gray-600 outline-none text-sm"
                                        placeholder="e.g. Get Started"
                                    />
                                </div>

                                {/* Button URL Input */}
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" /> Destination URL
                                    </label>
                                    <input
                                        type="text"
                                        value={urlValue as string || ''}
                                        onChange={(e) => handleChange(urlKey, e.target.value)}
                                        className="w-full p-2.5 bg-brand-dark/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-primary/50 text-white placeholder-gray-600 outline-none text-sm font-mono"
                                        placeholder="e.g. /pricing or https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }

                // Standard Rendering
                if (Array.isArray(value)) {
                    renderedKeys.add(key);
                    return renderArray(key, value);
                } else if (typeof value === 'object' && value !== null) {
                    renderedKeys.add(key);
                    return (
                        <div key={key} className="pl-4 border-l-2 border-brand-primary/20 mb-4">
                            <h4 className="font-semibold text-gray-400 mb-2 capitalize">{key}</h4>
                            <DynamicEditor data={value} onChange={(newData) => handleChange(key, newData)} sectionName={sectionName} />
                        </div>
                    );
                } else {
                    renderedKeys.add(key);
                    return renderInput(key, value);
                }
            })}
        </div>
    );
}
