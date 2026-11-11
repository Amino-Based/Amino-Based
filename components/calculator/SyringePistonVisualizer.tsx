"use client";

import React, { useState, useId, useRef, useCallback } from "react";
import {
  RotateCcw,
  Activity,
  Info,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";

interface SyringePistonVisualizerProps {
  massMg: number;
  volumeMl: number;
  onMassChange?: (mass: number) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

const DOSE_PRESETS = [100, 250, 500, 1000, 1500];

export default function SyringePistonVisualizer({
  massMg,
  volumeMl,
  onMassChange,
  onVolumeChange,
  className = "",
}: SyringePistonVisualizerProps) {
  const gradientId = useId();
  const liquidGradId = useId();
  const stopperGradId = useId();
  const shaftGradId = useId();
  const needleGradId = useId();

  // Target research dose in micrograms (mcg)
  const [targetDoseMcg, setTargetDoseMcg] = useState<number>(250);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHoveringBarrel, setIsHoveringBarrel] = useState<boolean>(false);

  const syringeSvgRef = useRef<SVGSVGElement>(null);

  // Core Mathematical Calculations
  const isValid = massMg > 0 && volumeMl > 0;
  const concentrationMgMl = isValid ? massMg / volumeMl : 0;
  const concentrationMcgMl = isValid ? concentrationMgMl * 1000 : 0;

  // Syringe draw volume (mL) and units on standard U-100 syringe (1 mL = 100 units)
  const drawMl = concentrationMcgMl > 0 ? targetDoseMcg / concentrationMcgMl : 0;
  const rawUnits = drawMl * 100;

  // Clamped between 0 and 100 units for physical syringe barrel display
  const clampedUnits = Math.min(100, Math.max(0, rawUnits));
  const isOverflow = rawUnits > 100;
  const isMicroDose = rawUnits > 0 && rawUnits < 5;

  // SVG Geometry constants (ViewBox: 0 0 880 170)
  // Barrel starts at X=130, ends at X=630 (Length = 500px for 100 units -> 5.0px per unit)
  const barrelStartX = 130;
  const barrelEndX = 630;
  const barrelWidth = barrelEndX - barrelStartX; // 500px
  const barrelTopY = 42;
  const barrelBottomY = 130;
  const barrelHeight = barrelBottomY - barrelTopY; // 88px

  // Piston stopper X position in SVG coordinates
  const pistonHeadX = barrelStartX + (clampedUnits / 100) * barrelWidth;
  const stopperWidth = 28; // Dual-ring rubber stopper width

  // Direct interactive drag/click on the syringe barrel
  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!syringeSvgRef.current) return;
      const rect = syringeSvgRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const scale = 880 / rect.width;
      const svgX = relativeX * scale;

      const newClampedX = Math.min(barrelEndX, Math.max(barrelStartX, svgX));
      const newUnits = ((newClampedX - barrelStartX) / barrelWidth) * 100;
      const roundedUnits = Math.round(newUnits * 2) / 2; // snap to 0.5 units

      if (concentrationMcgMl > 0) {
        const newDoseMcg = Math.round((roundedUnits / 100) * concentrationMcgMl);
        setTargetDoseMcg(Math.max(10, newDoseMcg));
      }
    },
    [concentrationMcgMl, barrelStartX, barrelEndX, barrelWidth]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    handlePointerMove(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handlePointerMoveEvent = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      handlePointerMove(e.clientX);
    }
  };

  const adjustDose = (delta: number) => {
    setTargetDoseMcg((prev) => Math.max(10, prev + delta));
  };

  return (
    <div
      id="syringe-visualizer"
      className={`mt-6 pt-5 border-t border-[#E4E4E7] ${className}`}
    >
      {/* ========================================================= */}
      {/* COMPACT DOSE CONTROLS & LIVE PISTON READOUT BAR           */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        
        {/* Left: Dose Stepper & Quick Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 mr-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-neutral-800" />
            <span>Target Dose:</span>
          </span>

          {/* Stepper with number input */}
          <div className="inline-flex items-center gap-1 bg-[#F6F7FB] border border-[#E4E4E7] rounded-full p-1 pr-2.5 shadow-2xs">
            <button
              type="button"
              onClick={() => adjustDose(-50)}
              className="w-6 h-6 rounded-full bg-white hover:bg-neutral-200 border border-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95 text-xs font-bold"
              aria-label="Decrease dose by 50 mcg"
            >
              <Minus className="w-3 h-3" />
            </button>

            <input
              type="number"
              min="10"
              max="20000"
              step="25"
              value={targetDoseMcg || ""}
              onChange={(e) => setTargetDoseMcg(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-16 text-center font-mono font-bold text-xs bg-transparent outline-none text-neutral-900"
              aria-label="Target dose in micrograms"
            />
            <span className="text-[10px] font-mono font-semibold text-neutral-500">mcg</span>

            <button
              type="button"
              onClick={() => adjustDose(50)}
              className="w-6 h-6 rounded-full bg-white hover:bg-neutral-200 border border-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95 text-xs font-bold"
              aria-label="Increase dose by 50 mcg"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick preset buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {DOSE_PRESETS.map((d) => {
              const isSelected = targetDoseMcg === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTargetDoseMcg(d)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 text-white font-bold shadow-2xs"
                      : "bg-[#F6F7FB] border border-[#E4E4E7] text-neutral-600 hover:text-black hover:bg-white"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live Piston Draw Value Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white font-mono text-xs font-bold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Draw to: {rawUnits.toFixed(1)} Units</span>
            <span className="text-neutral-400">({drawMl.toFixed(3)} mL)</span>
          </div>

          {isOverflow && (
            <span className="text-[11px] font-bold font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>&gt;1.0 mL</span>
            </span>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* THE VECTOR SYRINGE PISTON CANVAS (CLEAN, MEDICAL ACCURATE) */}
      {/* ========================================================= */}
      <div
        className={`relative w-full rounded-2xl bg-[#FAFAFC] border transition-all duration-200 p-2 sm:p-4 shadow-inner ${
          isDragging
            ? "border-black shadow-md cursor-grabbing"
            : isHoveringBarrel
            ? "border-neutral-400 shadow-sm cursor-grab"
            : "border-[#E4E4E7] cursor-grab"
        }`}
        onMouseEnter={() => setIsHoveringBarrel(true)}
        onMouseLeave={() => setIsHoveringBarrel(false)}
      >
        <svg
          ref={syringeSvgRef}
          viewBox="0 0 880 170"
          className="w-full h-auto block max-h-[160px]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMoveEvent}
          aria-label={`U-100 Graduated Syringe showing ${clampedUnits.toFixed(1)} units`}
        >
          <defs>
            {/* Glass Cylinder Translucency & Specular Highlights */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="18%" stopColor="#F8FAFC" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="82%" stopColor="#F1F5F9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.85" />
            </linearGradient>

            {/* Clear Aqueous Peptide Research Solution */}
            <linearGradient id={liquidGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#BAE6FD" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
            </linearGradient>

            {/* Medical-Grade Butyl Rubber Stopper (Piston Tip) */}
            <linearGradient id={stopperGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#1E293B" />
              <stop offset="70%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Polypropylene Plunger Shaft */}
            <linearGradient id={shaftGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.9" />
            </linearGradient>

            {/* Stainless Steel Needle Cannula */}
            <linearGradient id={needleGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="40%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Drop Shadow for Plunger Assembly */}
            <filter id="plungerDepth" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* 1. NEEDLE & NOZZLE (LEFT END) */}
          <rect
            x="20"
            y="84.5"
            width="80"
            height="3"
            fill={`url(#${needleGradId})`}
            rx="0.5"
          />
          <polygon points="20,84.5 30,83 30,86 20,86" fill="#334155" />

          {/* Luer Slip Nozzle Connector */}
          <polygon
            points="100,78 116,75 120,68 130,68 130,104 120,104 116,97 100,94"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />
          <line x1="116" y1="75" x2="116" y2="97" stroke="#94A3B8" strokeWidth="1" />

          {/* 2. LIQUID RESEARCH SOLUTION (INSIDE BARREL) */}
          {clampedUnits > 0 && (
            <g className="transition-all duration-150 ease-out">
              <rect
                x={barrelStartX}
                y={barrelTopY + 2}
                width={Math.max(0, pistonHeadX - barrelStartX)}
                height={barrelHeight - 4}
                fill={`url(#${liquidGradId})`}
              />
              <line
                x1={barrelStartX}
                y1={barrelTopY + 6}
                x2={Math.max(barrelStartX, pistonHeadX - 3)}
                y2={barrelTopY + 6}
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeOpacity="0.85"
              />
              <line
                x1={barrelStartX}
                y1={barrelBottomY - 5}
                x2={Math.max(barrelStartX, pistonHeadX - 3)}
                y2={barrelBottomY - 5}
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />
            </g>
          )}

          {/* 3. SYRINGE PISTON ASSEMBLY (SLIDING IN REAL TIME) */}
          <g
            className="transition-transform duration-150 ease-out will-change-transform"
            style={{ transform: `translateX(${pistonHeadX - barrelStartX}px)` }}
          >
            {/* RUBBER STOPPER (Dual-Seal Piston Head) */}
            <g filter="url(#plungerDepth)">
              <polygon
                points={`${barrelStartX},${barrelTopY + (barrelHeight / 2)} ${barrelStartX + 6},${barrelTopY + 2} ${barrelStartX + 6},${barrelBottomY - 2}`}
                fill="#0F172A"
              />
              <rect
                x={barrelStartX + 5}
                y={barrelTopY + 1}
                width={stopperWidth - 5}
                height={barrelHeight - 2}
                rx="2.5"
                fill={`url(#${stopperGradId})`}
              />
              {/* Front Sealing Ring */}
              <rect
                x={barrelStartX + 5}
                y={barrelTopY + 1}
                width="6"
                height={barrelHeight - 2}
                fill="#0F172A"
              />
              {/* Rear Wiper Ring */}
              <rect
                x={barrelStartX + stopperWidth - 7}
                y={barrelTopY + 1}
                width="6"
                height={barrelHeight - 2}
                fill="#0F172A"
              />
            </g>

            {/* PLUNGER SHAFT */}
            <rect
              x={barrelStartX + stopperWidth}
              y={barrelTopY + (barrelHeight / 2) - 7}
              width="230"
              height="14"
              fill={`url(#${shaftGradId})`}
              stroke="#94A3B8"
              strokeWidth="1"
            />
            <line
              x1={barrelStartX + stopperWidth}
              y1={barrelTopY + (barrelHeight / 2) - 2}
              x2={barrelStartX + stopperWidth + 230}
              y2={barrelTopY + (barrelHeight / 2) - 2}
              stroke="#FFFFFF"
              strokeWidth="1.8"
            />

            {/* THUMB PUSH FLANGE (Disk at end of plunger) */}
            <g filter="url(#plungerDepth)">
              <rect
                x={barrelStartX + stopperWidth + 230}
                y={barrelTopY - 10}
                width="12"
                height={barrelHeight + 20}
                rx="3.5"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <line
                x1={barrelStartX + stopperWidth + 234}
                y1={barrelTopY + 4}
                x2={barrelStartX + stopperWidth + 234}
                y2={barrelBottomY - 4}
                stroke="#64748B"
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* 4. TRANSPARENT GLASS BARREL BODY */}
          <rect
            x={barrelStartX}
            y={barrelTopY}
            width={barrelWidth}
            height={barrelHeight}
            fill={`url(#${gradientId})`}
            stroke="#64748B"
            strokeWidth="1.8"
            rx="3"
            fillOpacity="0.45"
          />

          {/* Cylindrical Glass Top Highlight Streak */}
          <line
            x1={barrelStartX + 2}
            y1={barrelTopY + 4}
            x2={barrelEndX - 2}
            y2={barrelTopY + 4}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeOpacity="0.85"
          />

          {/* Finger Grip Flanges (Collar wings) */}
          <path
            d={`M ${barrelEndX},${barrelTopY - 16} Q ${barrelEndX + 18},${barrelTopY - 16} ${barrelEndX + 18},${barrelTopY} L ${barrelEndX + 18},${barrelBottomY} Q ${barrelEndX + 18},${barrelBottomY + 16} ${barrelEndX},${barrelBottomY + 16} Z`}
            fill="#E2E8F0"
            stroke="#64748B"
            strokeWidth="1.8"
          />

          {/* 5. GRADUATION MARKS (0 TO 100 U-100) */}
          {Array.from({ length: 51 }).map((_, i) => {
            const unit = i * 2; // 0, 2, 4, ... 100
            const tickX = barrelStartX + (unit / 100) * barrelWidth;
            const isMajor10 = unit % 10 === 0;
            const isMid5 = unit % 5 === 0 && !isMajor10;
            const tickLen = isMajor10 ? 18 : isMid5 ? 12 : 7;

            return (
              <g key={`tick-${unit}`}>
                {/* Top Edge Tick Mark */}
                <line
                  x1={tickX}
                  y1={barrelTopY}
                  x2={tickX}
                  y2={barrelTopY + tickLen}
                  stroke={unit === 0 ? "#DC2626" : "#0F172A"}
                  strokeWidth={isMajor10 ? 1.6 : 0.85}
                />

                {/* Top IU Numerical Labels (0, 10, 20 ... 100) */}
                {isMajor10 && (
                  <text
                    x={tickX}
                    y={barrelTopY - 8}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    fontWeight="700"
                    fill={unit === 0 ? "#DC2626" : "#0F172A"}
                  >
                    {unit}
                  </text>
                )}

                {/* Bottom Edge Tick Mark */}
                <line
                  x1={tickX}
                  y1={barrelBottomY}
                  x2={tickX}
                  y2={barrelBottomY - tickLen}
                  stroke={unit === 0 ? "#DC2626" : "#334155"}
                  strokeWidth={isMajor10 ? 1.4 : 0.75}
                />

                {/* Bottom Metric Volume Labels (0.2, 0.4 ... 1.0 mL) */}
                {isMajor10 && unit > 0 && unit % 20 === 0 && (
                  <text
                    x={tickX}
                    y={barrelBottomY + 16}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    fontWeight="600"
                    fill="#64748B"
                  >
                    {(unit / 100).toFixed(1)}mL
                  </text>
                )}
              </g>
            );
          })}

          {/* Barrel Center Subtle Inscription */}
          <text
            x={barrelStartX + barrelWidth / 2}
            y={barrelTopY + barrelHeight / 2 + 3}
            textAnchor="middle"
            fontSize="10"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            letterSpacing="0.12em"
            fill="#0F172A"
            fillOpacity="0.2"
          >
            AMINO BASED &bull; U-100 &bull; 1.0 mL
          </text>

          {/* REAL-TIME DYNAMIC CALIPER POINTER */}
          <line
            x1={pistonHeadX}
            y1={barrelTopY - 24}
            x2={pistonHeadX}
            y2={barrelTopY - 2}
            stroke="#0F172A"
            strokeWidth="1.6"
            strokeDasharray="2.5 2.5"
          />
          <polygon
            points={`${pistonHeadX},${barrelTopY} ${pistonHeadX - 4},${barrelTopY - 7} ${pistonHeadX + 4},${barrelTopY - 7}`}
            fill="#0F172A"
          />
        </svg>
      </div>

      {/* ========================================================= */}
      {/* TACTILE RANGE SCRUBBER BAR DIRECTLY BELOW SYRINGE         */}
      {/* ========================================================= */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 font-mono gap-3">
        <span className="shrink-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>0 IU</span>
        </span>

        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={clampedUnits}
          onChange={(e) => {
            const units = parseFloat(e.target.value);
            if (concentrationMcgMl > 0) {
              setTargetDoseMcg(Math.max(10, Math.round((units / 100) * concentrationMcgMl)));
            }
          }}
          className="flex-1 h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-black transition-all"
          aria-label="Direct Syringe Units Slider"
        />

        <span className="shrink-0 flex items-center gap-1">
          <span>100 IU (1.0 mL)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
        </span>
      </div>
    </div>
  );
}
