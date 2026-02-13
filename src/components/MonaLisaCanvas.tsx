"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MonaLisaCanvasProps {
    progress: number; // 0 to 1 scroll progress
    activeMode: boolean; // Confession accepted mode
}

export default function MonaLisaCanvas({ progress, activeMode }: MonaLisaCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Mouse position for active painting
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Load Image
    const imageRef = useRef<HTMLImageElement | null>(null);
    useEffect(() => {
        const img = new Image();
        img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg";
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            imageRef.current = img;
            // Initial render if needed
        };
    }, []);

    // Handle Active Painting Logic
    useEffect(() => {
        if (!activeMode || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size to container size
        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };
        resize();
        window.addEventListener("resize", resize);

        // Painting Loop
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.globalCompositeOperation = "source-over";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 20;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(255, 180, 160, 0.5)"; // Peach glow

            // Random pastel color
            const baseHue = 15 + Math.random() * 30; // Peach/Orange range
            ctx.strokeStyle = `hsla(${baseHue}, 80%, 70%, 0.5)`;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 1, y + 1); // Paint dots/lines
            ctx.stroke();

            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setHasInteracted(true);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [activeMode]);

    // Derived visual states based on progress
    // 0.0 - 0.2: Blank -> Sketch
    // 0.2 - 0.5: Sketch -> Underpaint
    // 0.5 - 0.8: Underpaint -> Detail
    // 0.8 - 1.0: Detail -> Final

    // CSS Filters for simulation
    const blurAmount = Math.max(0, 20 * (1 - progress * 1.5)); // Starts blurry, clears up
    const grayscaleAmount = Math.max(0, 100 * (1 - progress * 2)); // Starts grayscale
    const opacityAmount = Math.min(1, progress * 1.2);
    const contrastAmount = 80 + (progress * 40); // 80% to 120%
    const sepiaAmount = Math.max(0, 50 * (1 - progress)); // Old feel at start

    return (
        <div ref={containerRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">

            {/* 1. Underlying Image (The Goal) */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-100 ease-linear"
                style={{
                    backgroundImage: `url('/mona-lisa.jpg')`,
                    backgroundPosition: "center 20%",
                    filter: `blur(${blurAmount}px) grayscale(${grayscaleAmount}%) contrast(${contrastAmount}%) sepia(${sepiaAmount}%) opacity(${opacityAmount})`,
                }}
            />

            {/* 2. Overlay Sketch Effect (CSS Mask/Blend) */}
            {progress < 0.6 && (
                <div
                    className="absolute inset-0 bg-cover bg-no-repeat opacity-50 mix-blend-multiply pointer-events-none"
                    style={{
                        backgroundImage: `url('/mona-lisa.jpg')`,
                        backgroundPosition: "top center",
                        filter: "contrast(200%) grayscale(100%) brightness(150%)", // High contrast sketch look
                        opacity: 1 - progress * 1.5
                    }}
                />
            )}

            {/* 3. Active Painting Layer (For Finale) */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-20 ${activeMode ? 'cursor-none pointer-events-auto' : 'pointer-events-none'}`}
            />

            {/* Custom Cursor for Active Mode */}
            {activeMode && (
                <motion.div
                    style={{ x: cursorX, y: cursorY }}
                    className="fixed top-0 left-0 w-8 h-8 bg-primary/80 rounded-full blur-sm pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"
                />
            )}

            {/* Interaction Hint */}
            {activeMode && !hasInteracted && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm animate-bounce">
                    Move your mouse to paint
                </div>
            )}

        </div>
    );
}
