"use client";

import { useEffect, useState } from "react";
import FloatingElement from "./FloatingElement";

export default function BackgroundFloatingElements() {
    const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {Array.from({ length: 15 }).map((_, i) => (
                <FloatingElement
                    key={i}
                    x={Math.random() * dimensions.width}
                    y={Math.random() * dimensions.height * 2}
                    width={20 + Math.random() * 40}
                    height={20 + Math.random() * 40}
                    className="rounded-full bg-primary/20 blur-xl"
                >
                    <div className="w-full h-full" />
                </FloatingElement>
            ))}
            {/* Chat bubble shapes */}
            <FloatingElement x={dimensions.width * 0.2} y={dimensions.height * 0.3} width={60} height={60} className="rounded-2xl bg-secondary/10 blur-sm">
                <div />
            </FloatingElement>
            <FloatingElement x={dimensions.width * 0.8} y={dimensions.height * 0.6} width={80} height={50} className="rounded-2xl bg-accent/10 blur-sm">
                <div />
            </FloatingElement>
        </>
    );
}
