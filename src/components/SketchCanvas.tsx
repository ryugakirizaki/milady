"use client";

import { motion } from "framer-motion";

interface SketchCanvasProps {
    stage: "blank" | "outline" | "detail" | "color" | "final";
}

export default function SketchCanvas({ stage }: SketchCanvasProps) {
    // SVG Path for a simple abstract face/portrait
    const faceOutline = "M100,50 Q150,10 200,50 T300,50 T400,100 T350,250 T200,350 T50,250 T100,50";
    const eyeLeft = "M130,120 Q150,110 170,120";
    const eyeRight = "M230,120 Q250,110 270,120";
    const smile = "M150,200 Q200,250 250,200";

    // Transition logic based on stage
    const showOutline = stage !== "blank";
    const showDetail = stage === "detail" || stage === "color" || stage === "final";
    const showColor = stage === "color" || stage === "final";
    const isFinal = stage === "final";

    // Use specific type assertion or separate object to satisfy TS
    const drawTransition = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 2,
                ease: "easeInOut" as const
            }
        },
    };

    return (
        <div className="relative w-80 h-96 mx-auto">
            <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                {/* Outline */}
                <motion.path
                    d={faceOutline}
                    fill="transparent"
                    stroke="var(--color-primary)"
                    strokeWidth="4"
                    initial="hidden"
                    animate={showOutline ? "visible" : "hidden"}
                    variants={drawTransition}
                />

                {/* Details (Eyes, Mouth) */}
                {showDetail && (
                    <>
                        <motion.path d={eyeLeft} fill="transparent" stroke="var(--color-foreground)" strokeWidth="3" initial="hidden" animate="visible" variants={drawTransition} />
                        <motion.path d={eyeRight} fill="transparent" stroke="var(--color-foreground)" strokeWidth="3" initial="hidden" animate="visible" variants={drawTransition} />
                        <motion.path d={smile} fill="transparent" stroke="var(--color-foreground)" strokeWidth="3" initial="hidden" animate="visible" variants={drawTransition} />
                    </>
                )}

                {/* Color Fills (Abstract splashes) */}
                {showColor && (
                    <motion.circle
                        cx="200" cy="200" r="120"
                        fill="var(--color-secondary)"
                        opacity="0.2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                    />
                )}

                {/* Final Glow */}
                {isFinal && (
                    <motion.circle
                        cx="200" cy="200" r="150"
                        fill="url(#glow)"
                        opacity="0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 2 }}
                    />
                )}

                <defs>
                    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}
