"use client";

import { motion } from "framer-motion";
import { forwardRef, useState, type HTMLAttributes, useRef } from "react";

interface BlockProps extends HTMLAttributes<HTMLDivElement> {}

const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ className, ...props }, ref) => {
    const divRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
      if (!divRef.current || isFocused) return;

      const div = divRef.current;
      const rect = div.getBoundingClientRect();

      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
      setIsFocused(true);
      setOpacity(1);
    };

    const handleBlur = () => {
      setIsFocused(false);
      setOpacity(0);
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    return (
      <motion.section
        initial={{ opacity: 0, y: Math.random() * 50, x: Math.random() * 50 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.8, ease: "anticipate" }}
        ref={ref}
        className={"relative text-white break-inside-avoid mb-2 max-w-[250px]"}
      >
        <div
          {...props}
          onMouseMove={handleMouseMove}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`w-full cursor-default rounded-lg border border-neutral-800 bg-neutral-950 text-slate-100 transition-colors duration-200 hover:border-amber-600/50 ${className}`}
        >
          {props.children}
        </div>
        <div
          ref={divRef}
          style={{
            border: "1px solid #f59e0b",
            opacity,
            background: `radial-gradient(100% 200px at ${position.x}px ${position.y}px, #f59e0b15, transparent)`,
            WebkitMaskImage: `radial-gradient(90% 90px at ${position.x}px ${position.y}px, black 45%, transparent)`,
          }}
          className="border-[#f59e0b] pointer-events-none absolute inset-0 z-10 w-full cursor-default rounded-lg border bg-[transparent] opacity-0 transition-opacity duration-1000 placeholder:select-none"
        />
      </motion.section>
    );
  },
);

export default Block;
