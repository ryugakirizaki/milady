"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useTransform } from "framer-motion";
import MonaLisaCanvas from "./MonaLisaCanvas";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Heart, RotateCcw } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Utility for premium glassy cards
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={twMerge("bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 text-center max-w-2xl mx-6 transition-all duration-500 hover:shadow-white/20", className)}>
            {children}
        </div>
    );
}

// Typography components
function Title({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h2 className={twMerge("text-3xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight drop-shadow-sm", className)}>{children}</h2>;
}

function Text({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={twMerge("text-lg md:text-2xl text-gray-800 font-medium leading-relaxed mb-4 drop-shadow-sm", className)}>{children}</p>;
}

function Highlight({ children }: { children: React.ReactNode }) {
    return <span className="text-rose-600 font-bold drop-shadow-sm">{children}</span>;
}

function Pause() {
    return <div className="h-20" aria-hidden="true" />;
}

export default function ScrollStory() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Progress State
    const [progress, setProgress] = useState(0);
    const [activePaintingMode, setActivePaintingMode] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: (self) => setProgress(self.progress),
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleYes = () => {
        setAccepted(true);
        // No active painting mode anymore
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    };

    const handleNo = () => {
        setRejected(true);
    };

    return (
        <div ref={containerRef} className="relative w-full">

            {/* FIXED BACKGROUND */}
            <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className={`relative w-full h-full transition-all duration-1000 ${accepted ? 'scale-110 opacity-100' : 'opacity-80'}`}>
                    <MonaLisaCanvas progress={progress} activeMode={activePaintingMode} />
                </div>
            </div>

            {/* SCROLLABLE STORY CONTENT */}
            <div className="relative z-10 w-full flex flex-col items-center">

                {/* Screen 1: Blank Canvas */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card>
                        <Title>Every painting begins with an empty canvas.</Title>
                        <Pause />
                        <Text>Quiet.</Text>
                        <Text>Undisturbed.</Text>
                        <Text>Waiting for something… or someone.</Text>
                        <Pause />
                        <Text className="italic text-gray-600">So did my life.</Text>
                    </Card>
                </div>

                {/* Screen 2: First Sketch (Notification) */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card className="transform rotate-1 hover:rotate-0 transition-transform duration-500">
                        <Title>Then one day… a message appeared.</Title>
                        <Pause />
                        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 max-w-sm mx-auto my-8 border border-gray-100 text-left transform scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
                                <span className="text-xs uppercase font-bold text-gray-400">Notification</span>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">New Message</p>
                            <p className="text-gray-600">Hi! Nice to meet you.</p>
                        </div>
                        <Pause />
                        <Text>You were just someone a friend introduced.</Text>
                        <Text>A name on my screen.</Text>
                        <Text>A stranger in my notifications.</Text>
                    </Card>
                </div>

                {/* Screen 3: Conversations */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card>
                        <Title>We talked.</Title>
                        <Text>About random things.</Text>
                        <Text>Important things.</Text>
                        <Text>Completely meaningless things.</Text>
                        <Pause />
                        <Text>We joked.</Text>
                        <Text>We confused each other.</Text>
                        <Text>We misunderstood… and laughed anyway.</Text>
                        <Pause />
                        <Text className="italic">You pretended not to see my messages sometimes.</Text>
                        <Pause />
                        <Text className="font-bold text-gray-900">But somehow… you always replied.</Text>
                    </Card>
                </div>

                {/* Screen 4: Inside Jokes */}
                <div className="min-h-screen w-full flex flex-col justify-center items-center py-20 gap-8 px-4">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="self-start md:ml-32 bg-white/80 backdrop-blur-md p-6 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-xl max-w-md border-l-4 border-primary"
                    >
                        <p className="text-xl text-gray-800 font-medium">"You kept shooing me away…"</p>
                        <p className="text-gray-500 mt-2 italic">Hut hut! 🧹 Shooing you away!</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="self-end md:mr-32 bg-gray-900/90 text-white p-6 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl shadow-xl max-w-md border-r-4 border-secondary text-right"
                    >
                        <p className="text-xl font-medium">"Wait, are you really ignoring that message now?" 🤨</p>
                        <p className="text-gray-400 mt-2 italic">I kept coming back.</p>
                    </motion.div>

                    <div className="mt-20 text-center bg-white/60 backdrop-blur-xl p-10 rounded-3xl max-w-2xl mx-auto shadow-2xl border border-white/40">
                        <Text>You dodged my calls like a professional.</Text>
                        <Text>But never our conversations.</Text>
                        <Pause />
                        <Text>You thought I was teasing.</Text>
                        <Text>I thought you knew I wasn’t.</Text>
                        <Pause />
                        <Title className="text-3xl mt-4">Turns out… we were both just pretending to be <Highlight>calm</Highlight>.</Title>
                    </div>
                </div>

                {/* Screen 5: Painting Begins */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card>
                        <Title>Somewhere along the way…</Title>
                        <Pause />
                        <Text>I started imagining you.</Text>
                        <Text>Not how you look — but how you are.</Text>
                        <Pause />
                        <Text>Your humor.</Text>
                        <Text>Your chaos.</Text>
                        <Text>Your strange logic.</Text>
                        <Pause />
                        <Text className="text-3xl font-serif text-rose-600 italic">Every message became a brush stroke.</Text>
                        <div className="my-8 flex justify-center">
                            <Heart className="w-12 h-12 text-pink-500 fill-pink-500 animate-pulse drop-shadow-lg" />
                        </div>
                        <Text className="font-bold text-gray-900">I was painting you in my mind.</Text>
                    </Card>
                </div>

                {/* Screen 6: Realization */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card>
                        <Title>The strange part is…</Title>
                        <Pause />
                        <Text>I’ve never seen you.</Text>
                        <Pause />
                        <Title className="italic text-gray-800">Yet somehow you stopped feeling like a stranger.</Title>
                    </Card>
                </div>

                {/* Screen 7: Importance */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card>
                        <Text>Somewhere between random conversations…</Text>
                        <Pause />
                        <Text>and waiting for your replies…</Text>
                        <div className="my-8 flex justify-center">
                            <Heart className="w-16 h-16 text-red-500 fill-red-500 drop-shadow-2xl animate-bounce" />
                        </div>
                        <Title className="text-4xl md:text-6xl text-gray-900 font-bold">You became an important part of my day.</Title>
                        <Pause />
                        <Text>Not planned.</Text>
                        <Text>Not expected.</Text>
                        <Pause />
                        <Text className="italic text-gray-600">Just… happened.</Text>
                    </Card>
                </div>

                {/* Screen 8: Final Touch */}
                <div className="min-h-screen flex items-center justify-center py-20">
                    <Card>
                        <Title>I don’t know if the picture in my mind is accurate.</Title>
                        <Pause />
                        <Text>But I know one thing.</Text>
                        <div className="my-8 flex justify-center">
                            <Heart className="w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-md" />
                        </div>
                        <Title>I enjoyed creating it.</Title>
                    </Card>
                </div>

                {/* Screen 9: Confession */}
                <div className="min-h-screen w-full flex flex-col items-center justify-center py-20 pb-40">
                    {(!accepted && !rejected) && (
                        <Card className="animate-in fade-in zoom-in duration-1000 bg-white/60">
                            <Title>So maybe…</Title>
                            <Pause />
                            <Text>we can keep adding colors to it together?</Text>
                            <div className="my-8 flex justify-center">
                                <Heart className="w-16 h-16 text-pink-600 fill-pink-600 animate-pulse drop-shadow-xl" />
                            </div>
                            <Text className="font-bold text-gray-900 mb-8 text-xl">Whatever you choose… thank you for becoming part of my story.</Text>

                            <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
                                <button
                                    onClick={handleYes}
                                    className="bg-gray-900 text-white px-12 py-6 rounded-full text-xl font-serif hover:bg-gray-800 hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                                >
                                    <span>Yes, let's paint</span>
                                    <Heart className="w-5 h-5 fill-white" />
                                </button>
                                <button
                                    onClick={handleNo}
                                    className="bg-white/50 border-2 border-gray-400 text-gray-600 px-10 py-6 rounded-full text-xl font-serif hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm"
                                >
                                    No, keep it abstract
                                </button>
                            </div>
                        </Card>
                    )}

                    {/* YES SCENE */}
                    {accepted && (
                        <Card className="animate-in fade-in zoom-in duration-1000 bg-white/60">
                            <Title>Then I guess…</Title>
                            <Text>I finally get to paint the real you.</Text>
                            <div className="my-8 flex justify-center">
                                <Heart className="w-16 h-16 text-pink-500 fill-pink-500 animate-pulse drop-shadow-xl" />
                            </div>
                            <Text>Not just in my mind.</Text>
                            <Pause />
                            <Text className="font-bold text-gray-900 text-2xl">Thank you for giving this story a chance.</Text>

                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-gray-900 text-white px-10 py-5 rounded-full text-lg font-serif hover:bg-gray-800 transition-all shadow-xl flex items-center gap-3"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    <span>Play Again</span>
                                </button>
                            </div>
                        </Card>
                    )}

                    {/* NO SCENE */}
                    {rejected && (
                        <Card className="bg-gray-100/80 border-none">
                            <Title>That’s okay.</Title>
                            <Text>Some paintings are meant to stay in the artist’s heart.</Text>
                            <div className="my-6 flex justify-center">
                                <Heart className="w-12 h-12 text-gray-400 fill-gray-400" />
                            </div>
                            <Text>I’ll still be glad I got to paint you.</Text>
                            <Pause />
                            <Text className="italic mb-8">And I’ll keep painting… because you inspired me.</Text>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-transparent border-2 border-gray-400 text-gray-600 px-8 py-4 rounded-full text-lg font-serif hover:bg-white hover:text-gray-900 transition-all flex items-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Play Again</span>
                                </button>
                            </div>
                        </Card>
                    )}

                </div>

            </div>
        </div>
    );
}
