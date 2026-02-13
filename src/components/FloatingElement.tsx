"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { usePhysics } from "./PhysicsCanvas";

interface FloatingElementProps {
    children: React.ReactNode;
    x: number;
    y: number;
    width?: number;
    height?: number;
    className?: string;
}

export default function FloatingElement({ children, x, y, width = 100, height = 100, className }: FloatingElementProps) {
    const { world } = usePhysics();
    const elementRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<Matter.Body | null>(null);

    useEffect(() => {
        if (!world || !elementRef.current) return;

        // Create a body for this element
        const body = Matter.Bodies.rectangle(x, y, width, height, {
            frictionAir: 0.05, // High air friction for floating feel
            restitution: 0.8, // Bouncy
            density: 0.01,
            angle: Math.random() * Math.PI * 0.1, // Slight random angle
        });
        bodyRef.current = body;

        Matter.World.add(world, body);

        // Sync DOM position with Physics Body
        const updatePosition = () => {
            if (bodyRef.current && elementRef.current) {
                const { position, angle } = bodyRef.current;
                // We use transform to move the visual element
                // Adjust for center origin of Matter.js bodies vs top-left of DOM
                elementRef.current.style.transform = `translate(${position.x - width / 2}px, ${position.y - height / 2}px) rotate(${angle}rad)`;
            }
            requestAnimationFrame(updatePosition);
        };

        const animId = requestAnimationFrame(updatePosition);

        return () => {
            cancelAnimationFrame(animId);
            if (bodyRef.current) {
                Matter.World.remove(world, bodyRef.current);
            }
        };
    }, [world, x, y, width, height]);

    return (
        <div
            ref={elementRef}
            className={`absolute top-0 left-0 ${className}`}
            style={{ width, height, willChange: 'transform' }}
        >
            {children}
        </div>
    );
}
