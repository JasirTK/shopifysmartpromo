"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, ChevronRight } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_QUESTIONS = [
    "How do I improve my SEO?",
    "What is the best way to increase sales?",
    "How does the pricing work?",
    "Can I sync my Shopify customers?",
];

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "Hi there! I'm your **Smart Promo AI assistant**. \n\nAsk me anything about Shopify growth, SEO, or how to use this app." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (text: string = input) => {
        if (!text.trim()) return;

        // Add User Message
        setMessages(prev => [...prev, { role: 'user', text: text }]);
        setInput('');
        setIsTyping(true);

        try {
            // Simulate network delay for realism if it responds too fast
            const minDelay = new Promise(resolve => setTimeout(resolve, 800));

            const [res] = await Promise.all([
                sendChatMessage(sessionId, text),
                minDelay
            ]);

            setMessages(prev => [...prev, { role: 'bot', text: res.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: 'I seem to be having trouble connecting. Please try again later.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={toggleOpen}
                className={`fixed bottom-8 right-8 p-0 w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-full shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:scale-105 transition-all z-50 flex items-center justify-center group ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <div className="absolute inset-0 rounded-full border border-white/20"></div>
                <MessageCircle className="w-8 h-8 fill-current" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#05050A]"></span>
                </span>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-8 right-8 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-[#0A0A0F]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all duration-300 z-50 flex flex-col ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 p-5 flex justify-between items-center border-b border-white/10 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 border border-white/10">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg leading-tight">Smart Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-brand-primary-light font-medium">Online & Ready</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={toggleOpen} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-primary/50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${msg.role === 'user' ? 'bg-gray-800' : 'bg-brand-surface'
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-gray-400" /> : <Sparkles className="w-4 h-4 text-brand-primary" />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-tr-none'
                                : 'bg-brand-surface/80 border border-white/5 text-gray-200 rounded-tl-none'
                                }`}>
                                {msg.role === 'bot' ? (
                                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                                        <ReactMarkdown
                                            components={{
                                                a: ({ ...props }) => <a {...props} className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer" />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center shrink-0 border border-white/5">
                                <Sparkles className="w-4 h-4 text-brand-primary" />
                            </div>
                            <div className="bg-brand-surface/80 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions (Current Context) */}
                {messages.length < 3 && !isTyping && (
                    <div className="px-5 pb-2">
                        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider ml-1">Suggested Topics</div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {SUGGESTED_QUESTIONS.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(q)}
                                    className="whitespace-nowrap px-4 py-2 bg-brand-surface/50 hover:bg-brand-primary/20 border border-white/5 hover:border-brand-primary/30 rounded-xl text-xs text-gray-300 hover:text-white transition-all snap-start"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-[#0A0A0F]/80 backdrop-blur-md border-t border-white/5">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your store..."
                            className="w-full bg-brand-surface/50 border border-white/10 text-white placeholder-gray-500 pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all font-medium"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-brand-primary transition-colors shadow-lg"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center mt-2.5">
                        <span className="text-[10px] text-gray-600 font-medium tracking-wide">
                            Powered by Smart Promo AI Engine
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
