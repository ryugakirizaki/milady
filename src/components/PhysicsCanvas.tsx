"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import Matter from "matter-js";

interface PhysicsContextType {
  engine: Matter.Engine | null;
  world: Matter.World | null;
}

const PhysicsContext = createContext<PhysicsContextType>({ engine: null, world: null });

export const usePhysics = () => useContext(PhysicsContext);

export default function PhysicsCanvas({ children }: { children: React.ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Initialize Matter.js Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 }, // Zero gravity for floating effect
    });
    engineRef.current = engine;

    // Render configuration (mostly for debugging, we'll use DOM elements for actual UI)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframes: false,
        showAxes: false,
        showVelocity: false,
      },
    });
    renderRef.current = render;

    // Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);
    // Matter.Render.run(render); // Uncomment to see debug canvas

    // Mouse control (optional interaction with physics bodies)
    const mouse = Matter.Mouse.create(sceneRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.World.add(engine.world, mouseConstraint);

    // Wall boundaries to keep elements in view (can be adjusted)
    const walls = [
      Matter.Bodies.rectangle(window.innerWidth / 2, -500, window.innerWidth, 1000, { isStatic: true }),
      Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 500, window.innerWidth, 1000, { isStatic: true }),
      Matter.Bodies.rectangle(window.innerWidth + 500, window.innerHeight / 2, 1000, window.innerHeight, { isStatic: true }),
      Matter.Bodies.rectangle(-500, window.innerHeight / 2, 1000, window.innerHeight, { isStatic: true }),
    ];
    Matter.World.add(engine.world, walls);

    // Resize handler
    const handleResize = () => {
      if (renderRef.current) {
        renderRef.current.canvas.width = window.innerWidth;
        renderRef.current.canvas.height = window.innerHeight;
      }
      // Re-position walls... simplified for now
    };

    window.addEventListener("resize", handleResize);
    setIsReady(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
            renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <PhysicsContext.Provider value={{ engine: engineRef.current, world: engineRef.current?.world || null }}>
      <div 
        ref={sceneRef} 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </PhysicsContext.Provider>
  );
}
