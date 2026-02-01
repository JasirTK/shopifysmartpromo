"use client";

import { useEffect, useState } from 'react';

interface AnnouncementBarProps {
    content: any;
}

export default function AnnouncementBar({ content }: AnnouncementBarProps) {
    if (!content || !content.enabled) return null;

    const messages = content.messages || [];
    if (messages.length === 0) return null;

    // Duplicate messages to create seamless loop
    const displayMessages = [...messages, ...messages, ...messages, ...messages];

    return (
        <div
            className="w-full relative z-[60] overflow-hidden"
            style={{
                backgroundColor: content.background_color || '#111827',
                color: content.text_color || '#ffffff'
            }}
        >
            <div className="py-2.5 flex items-center">
                <div className="flex gap-8 items-center animate-marquee whitespace-nowrap pause-on-hover hover:cursor-default"
                    style={{
                        animationDuration: `${content.speed || 30}s`
                    }}
                >
                    {displayMessages.map((msg: any, i: number) => (
                        <span key={i} className="text-sm font-medium tracking-wide flex items-center gap-2 px-4">
                            {msg.text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
