"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function FinaleOverlay({ onClose }: { onClose: () => void }) {
    const [showMonaLisa, setShowMonaLisa] = useState(false);

    useEffect(() => {
        // Trigger confetti burst
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFB7A1', '#FF9E80', '#FF8A65']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFB7A1', '#FF9E80', '#FF8A65']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            } else {
                setShowMonaLisa(true);
            }
        };

        frame();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="max-w-2xl"
            >
                <h1 className="text-4xl md:text-6xl font-serif text-accent mb-8">Thank you...</h1>
                <p className="text-2xl text-foreground/80 mb-12">"Then I finally get to paint the real you."</p>

                {showMonaLisa && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 2 }}
                        className="w-64 h-80 bg-white shadow-2xl mx-auto border-8 border-yellow-900/20 relative overflow-hidden"
                    >
                        {/* Abstract Mona Lisa Representation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-900/10" />
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-foreground/10 rounded-full blur-xl" />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-40 bg-foreground/20 rounded-t-full blur-md" />
                        <p className="absolute bottom-2 w-full text-center text-xs text-foreground/40 font-serif italic">Your Portrait</p>
                    </motion.div>
                )}

                <button
                    onClick={onClose}
                    className="mt-12 text-foreground/50 hover:text-foreground transition-colors underline"
                >
                    Back to story
                </button>
            </motion.div>
        </motion.div>
    );
}
