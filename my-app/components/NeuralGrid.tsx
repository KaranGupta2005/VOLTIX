"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Database,
    Smartphone,
    Activity,
    Bot,
    Zap,
    ShieldCheck,
    Truck,
    TrafficCone,
    Wrench
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function NeuralGrid() {
    return (
        <section className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center py-20">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px]" />
            </div>

            {/* HEADER */}
            <div className="relative z-10 text-center mb-0 md:mb-12">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Neural Grid Architecture
                </h2>
                <p className="text-neutral-500 mt-4 max-w-2xl mx-auto">
                    The Hive Mind: How data flows from reality to resolution.
                </p>
            </div>

            {/* ARCHITECTURE DIAGRAM CONTAINER */}
            <div className="relative w-full max-w-7xl h-[600px] md:h-[800px] flex items-center justify-center">

                {/* 1. INPUT ZONE (Left) */}
                <div className="absolute left-[5%] md:left-[10%] top-1/2 -translate-y-1/2 flex flex-col gap-16 z-20">
                    <InputNode
                        icon={<Activity className="w-6 h-6" />}
                        label="Grid Telemetry"
                        color="text-red-400"
                        borderColor="border-red-500/50"
                        particleColor="#f87171"
                        delay={0}
                    />
                    <InputNode
                        icon={<Smartphone className="w-6 h-6" />}
                        label="User App"
                        color="text-yellow-400"
                        borderColor="border-yellow-500/50"
                        particleColor="#facc15"
                        delay={1.5}
                    />
                    <InputNode
                        icon={<Database className="w-6 h-6" />}
                        label="Historical Data"
                        color="text-blue-400"
                        borderColor="border-blue-500/50"
                        particleColor="#60a5fa"
                        delay={3}
                    />
                </div>

                {/* 2. THE CORE (Center) */}
                <div className="relative z-30">
                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-64 h-64 md:w-96 md:h-96 rounded-full border border-emerald-500/20 border-dashed absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 md:w-72 md:h-72 rounded-full border border-cyan-500/20 border-dotted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />

                    {/* Glass Core */}
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-black/40 backdrop-blur-xl border border-emerald-500/50 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] relative z-40">
                        <Bot className="w-8 h-8 md:w-12 md:h-12 text-emerald-400 mb-2" />
                        <div className="text-[10px] md:text-xs font-mono text-emerald-200 text-center">
                            SUPERVISOR<br />CORE
                        </div>
                    </div>
                </div>

                {/* 3. OUTPUT ZONE (Right - Semi Circle) */}
                <div className="absolute right-[5%] md:right-[15%] top-1/2 -translate-y-1/2 h-[400px] flex flex-col justify-between z-20">
                    <AgentOutput icon={<Wrench className="w-5 h-5" />} label="Mechanic" color="bg-red-500" />
                    <AgentOutput icon={<TrafficCone className="w-5 h-5" />} label="Traffic" color="bg-purple-500" />
                    <AgentOutput icon={<Truck className="w-5 h-5" />} label="Logistics" color="bg-blue-500" />
                    <AgentOutput icon={<Zap className="w-5 h-5" />} label="Energy" color="bg-amber-500" />
                    <AgentOutput icon={<ShieldCheck className="w-5 h-5" />} label="Auditor" color="bg-neutral-500" />
                </div>

                {/* ANIMATED CONNECTIONS (SVG Layer) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.1)" />
                            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.3)" />
                            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.1)" />
                        </linearGradient>
                    </defs>

                    {/* Paths from Inputs to Core */}
                    {/* Telemetry (Top Left) -> Core */}
                    <ConnectionPath start={{ x: "15%", y: "30%" }} end={{ x: "50%", y: "50%" }} />
                    <ParticlePath start="M 15 30 L 50 50" color="#f87171" delay={0} />

                    {/* User App (Mid Left) -> Core */}
                    <ConnectionPath start={{ x: "15%", y: "50%" }} end={{ x: "50%", y: "50%" }} />
                    <ParticlePath start="M 15 50 L 50 50" color="#facc15" delay={1.5} />

                    {/* Data (Bot Left) -> Core */}
                    <ConnectionPath start={{ x: "15%", y: "70%" }} end={{ x: "50%", y: "50%" }} />
                    <ParticlePath start="M 15 70 L 50 50" color="#60a5fa" delay={3} />


                    {/* Paths from Core to Agents */}
                    {/* Core -> Mechanic (Top Right) */}
                    <ConnectionPath start={{ x: "50%", y: "50%" }} end={{ x: "85%", y: "20%" }} />
                    <ParticlePath start="M 50 50 L 85 20" color="#f87171" delay={1} />

                    {/* Core -> Traffic */}
                    <ConnectionPath start={{ x: "50%", y: "50%" }} end={{ x: "85%", y: "35%" }} />
                    <ParticlePath start="M 50 50 L 85 35" color="#facc15" delay={2.5} />

                    {/* Core -> Logistics */}
                    <ConnectionPath start={{ x: "50%", y: "50%" }} end={{ x: "85%", y: "50%" }} />
                    {/* Core -> Energy */}
                    <ConnectionPath start={{ x: "50%", y: "50%" }} end={{ x: "85%", y: "65%" }} />

                    {/* Core -> Auditor (Bot Right) */}
                    <ConnectionPath start={{ x: "50%", y: "50%" }} end={{ x: "85%", y: "80%" }} />
                    <ParticlePath start="M 50 50 L 85 80" color="#60a5fa" delay={3.5} />
                </svg>

            </div>
        </section>
    );
}

// --- Sub-Components ---

function InputNode({ icon, label, color, borderColor, particleColor, delay }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={cn(
                "relative w-12 h-12 md:w-16 md:h-16 rounded-xl bg-black/50 backdrop-blur-md border hover:scale-110 transition-transform duration-300 flex items-center justify-center",
                borderColor
            )}>
                {/* Flashing Pulse */}
                <motion.div
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, delay: delay, repeat: Infinity }}
                    className={cn("absolute inset-0 rounded-xl bg-current opacity-20 blur-md", color)}
                />
                <div className={color}>{icon}</div>
            </div>
            <span className="text-sm font-mono text-neutral-400 group-hover:text-white transition-colors">
                {label}
            </span>
        </div>
    );
}

function AgentOutput({ icon, label, color }: any) {
    return (
        <div className="flex items-center gap-4 flex-row-reverse group">
            <div className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-black border border-neutral-800 group-hover:border-white/50 transition-colors relative"
            )}>
                <div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black", color)} />
                <div className="text-neutral-300">{icon}</div>
            </div>
            <span className="text-xs md:text-sm font-mono text-neutral-500 group-hover:text-emerald-400 transition-colors text-right">
                {label}
            </span>
        </div>
    );
}

function ConnectionPath({ start, end }: { start: { x: string, y: string }, end: { x: string, y: string } }) {
    return (
        <line
            x1={start.x} y1={start.y}
            x2={end.x} y2={end.y}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="opacity-30"
        />
    );
}

function ParticlePath({ start, color, delay }: { start: string, color: string, delay: number }) {
    return (
        <motion.path
            d={start}
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
                pathLength: [0, 0.2, 0],
                opacity: [0, 1, 0],
                pathOffset: [0, 0.8, 1]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        />
    );
}
