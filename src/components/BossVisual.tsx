import React from 'react';
import { Boss } from '../../shared/types';

interface BossVisualProps {
  boss: Boss;
  phase: number;
  isHit?: boolean;
  isAttacking?: boolean;
  currentHpPercent: number;
  className?: string;
}

export const BossVisual: React.FC<BossVisualProps> = ({
  boss,
  phase,
  isHit = false,
  isAttacking = false,
  currentHpPercent,
  className = '',
}) => {
  const isEnraged = phase >= 3 || currentHpPercent <= 33;
  const isOverheating = phase === 2;

  return (
    <div
      className={`relative flex items-center justify-center select-none transition-all duration-300 ${
        isHit ? 'animate-bounce filter drop-shadow-[0_0_25px_rgba(239,68,68,0.9)] scale-95' : ''
      } ${isAttacking ? 'animate-pulse scale-105' : ''} ${className}`}
      style={{ minHeight: 220 }}
    >
      {/* Background Energy Aura */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl opacity-40 transition-all ${
          isEnraged
            ? 'bg-rose-600 animate-ping'
            : isOverheating
            ? 'bg-amber-500 animate-pulse'
            : 'bg-cyan-500'
        }`}
        style={{ transform: 'scale(0.85)' }}
      />

      {/* SVG Boss Renderer */}
      <svg
        viewBox="0 0 240 240"
        className="w-56 h-56 md:w-64 md:h-64 overflow-visible drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="electricGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <radialGradient id="sensorLens" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
          <radialGradient id="radioCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#831843" />
          </radialGradient>
          <radialGradient id="compilerCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>
        </defs>

        {/* BOSS 1: VOLT-9 */}
        {boss.avatarSvgType === 'volt9' && (
          <g>
            {/* Tesla Coils Left & Right */}
            <rect x="25" y="45" width="16" height="40" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="3" />
            <circle cx="33" cy="38" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
            <line x1="33" y1="28" x2="33" y2="15" stroke="#facc15" strokeWidth="3" />

            <rect x="199" y="45" width="16" height="40" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="3" />
            <circle cx="207" cy="38" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
            <line x1="207" y1="28" x2="207" y2="15" stroke="#facc15" strokeWidth="3" />

            {/* Spark Arcs between coils if enraged */}
            {isEnraged && (
              <path
                d="M 40 38 Q 120 10 200 38"
                fill="none"
                stroke="#facc15"
                strokeWidth="4"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            )}

            {/* Massive Shoulder Armor */}
            <path d="M 35 125 L 65 95 L 85 130 Z" fill="#475569" stroke="#0f172a" strokeWidth="4" />
            <path d="M 205 125 L 175 95 L 155 130 Z" fill="#475569" stroke="#0f172a" strokeWidth="4" />

            {/* Main Head Chassis */}
            <rect
              x="60"
              y="55"
              width="120"
              height="95"
              rx="22"
              fill={isHit ? '#ef4444' : '#1e293b'}
              stroke="#0f172a"
              strokeWidth="6"
            />

            {/* Visor Area */}
            <rect x="75" y="75" width="90" height="42" rx="10" fill="#020617" stroke="#334155" strokeWidth="3" />

            {/* Eyes - Electric Zig-Zags or Angry Slits */}
            {isEnraged ? (
              <g>
                <path d="M 85 92 L 105 102 L 95 106 Z" fill="#ef4444" />
                <path d="M 155 92 L 135 102 L 145 106 Z" fill="#ef4444" />
              </g>
            ) : (
              <g>
                <rect x="85" y="88" width="22" height="12" rx="3" fill="#facc15" />
                <rect x="133" y="88" width="22" height="12" rx="3" fill="#facc15" />
              </g>
            )}

            {/* Mouth Grille / Audio Speaker */}
            <line x1="95" y1="130" x2="145" y2="130" stroke="#facc15" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />

            {/* Torso & Core Battery */}
            <path d="M 65 150 L 175 150 L 165 220 L 75 220 Z" fill="#334155" stroke="#0f172a" strokeWidth="5" />
            {/* Battery Level Indicator */}
            <rect x="95" y="165" width="50" height="35" rx="6" fill="#090d16" stroke="#475569" strokeWidth="3" />
            <rect
              x="99"
              y="169"
              width={Math.max(4, Math.round(42 * (currentHpPercent / 100)))}
              height="27"
              rx="4"
              fill="url(#electricGlow)"
            />
            {/* Lightning bolt emblem on battery */}
            <path d="M 120 172 L 126 182 L 119 182 L 124 194 L 114 184 L 120 184 Z" fill="#ffffff" />
          </g>
        )}

        {/* BOSS 2: SENSOR-X */}
        {boss.avatarSvgType === 'sensorx' && (
          <g>
            {/* Radar dish on top */}
            <path d="M 80 40 Q 120 10 160 40" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="40" x2="120" y2="20" stroke="#10b981" strokeWidth="4" />
            <circle cx="120" cy="18" r="5" fill="#34d399" className="animate-ping" />

            {/* Giant Optical Chassis */}
            <circle
              cx="120"
              cy="115"
              r="68"
              fill={isHit ? '#ef4444' : '#0f172a'}
              stroke="#047857"
              strokeWidth="7"
            />

            {/* Rotating Sensor Ring */}
            <circle
              cx="120"
              cy="115"
              r="52"
              fill="#064e3b"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="16 8"
              className="animate-spin"
              style={{ animationDuration: '8s', transformOrigin: '120px 115px' }}
            />

            {/* Giant Central Iris / Lens */}
            <circle cx="120" cy="115" r="32" fill="url(#sensorLens)" stroke="#34d399" strokeWidth="4" />
            <circle cx="120" cy="115" r="14" fill="#022c22" />
            <circle cx="126" cy="110" r="5" fill="#ffffff" />

            {/* Scanning Laser Beam (sweep) */}
            <line
              x1="120"
              y1="115"
              x2="210"
              y2={isEnraged ? 150 : 115}
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="4 2"
              className="animate-pulse"
            />

            {/* Hydraulic Leg Piston Mounts */}
            <path d="M 70 175 L 50 225 L 85 225 L 95 180 Z" fill="#1e293b" stroke="#047857" strokeWidth="4" />
            <path d="M 170 175 L 190 225 L 155 225 L 145 180 Z" fill="#1e293b" stroke="#047857" strokeWidth="4" />
          </g>
        )}

        {/* BOSS 3: SIGNAL-404 */}
        {boss.avatarSvgType === 'signal404' && (
          <g>
            {/* Twin Corrupted Satellite Dishes */}
            <g transform="translate(30, 30) rotate(-20)">
              <ellipse cx="25" cy="25" rx="22" ry="14" fill="#374151" stroke="#ec4899" strokeWidth="4" />
              <line x1="25" y1="25" x2="35" y2="10" stroke="#f472b6" strokeWidth="3" />
            </g>
            <g transform="translate(160, 20) rotate(20)">
              <ellipse cx="25" cy="25" rx="22" ry="14" fill="#374151" stroke="#ec4899" strokeWidth="4" />
              <line x1="25" y1="25" x2="15" y2="10" stroke="#f472b6" strokeWidth="3" />
            </g>

            {/* Radio Wave Ripples */}
            <path d="M 20 70 Q 5 110 20 150" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="6 4" />
            <path d="M 220 70 Q 235 110 220 150" fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="6 4" />

            {/* Central Dreadnought Body */}
            <polygon
              points="120,45 190,95 180,185 120,215 60,185 50,95"
              fill={isHit ? '#ef4444' : '#1e1b4b'}
              stroke="#ec4899"
              strokeWidth="6"
            />

            {/* Corrupted Digital Glitch Visor */}
            <rect x="75" y="90" width="90" height="38" rx="6" fill="#000000" stroke="#db2777" strokeWidth="2.5" />
            <text x="82" y="115" fill="#f472b6" fontFamily="monospace" fontSize="16" fontWeight="bold">
              404_ERR
            </text>

            {/* Pulsing Transmitter Core */}
            <circle cx="120" cy="165" r="24" fill="url(#radioCore)" stroke="#f472b6" strokeWidth="3" />
            <circle cx="120" cy="165" r="10" fill="#ffffff" className="animate-ping" />
          </g>
        )}

        {/* BOSS 4: THE COMPILER */}
        {boss.avatarSvgType === 'compiler' && (
          <g>
            {/* Floating Curly Braces & Angle Bracket Runes */}
            <text x="25" y="70" fill="#a855f7" fontFamily="monospace" fontSize="34" fontWeight="bold" opacity="0.8">
              &#123;
            </text>
            <text x="195" y="70" fill="#a855f7" fontFamily="monospace" fontSize="34" fontWeight="bold" opacity="0.8">
              &#125;
            </text>
            <text x="30" y="170" fill="#c084fc" fontFamily="monospace" fontSize="28" fontWeight="bold" opacity="0.7">
              &lt;/&gt;
            </text>
            <text x="185" y="170" fill="#c084fc" fontFamily="monospace" fontSize="28" fontWeight="bold" opacity="0.7">
              ;&#x3A;
            </text>

            {/* Monolithic Crystal Body */}
            <polygon
              points="120,30 195,80 185,190 120,230 55,190 45,80"
              fill={isHit ? '#ef4444' : '#0f172a'}
              stroke="#8b5cf6"
              strokeWidth="6"
            />

            {/* Quantum Core Diamond */}
            <polygon
              points="120,70 160,115 120,160 80,115"
              fill="url(#compilerCore)"
              stroke="#c084fc"
              strokeWidth="3.5"
            />

            {/* Floating Terminal Screen in Center */}
            <rect x="90" y="98" width="60" height="34" rx="4" fill="#030712" stroke="#a855f7" strokeWidth="2" />
            <text x="96" y="114" fill="#22c55e" fontFamily="monospace" fontSize="9" fontWeight="bold">
              while True:
            </text>
            <text x="102" y="125" fill="#38bdf8" fontFamily="monospace" fontSize="9">
              &gt; EXECUTE
            </text>

            {/* Bottom Energy Pylon */}
            <line x1="85" y1="210" x2="120" y2="235" stroke="#a855f7" strokeWidth="4" />
            <line x1="155" y1="210" x2="120" y2="235" stroke="#a855f7" strokeWidth="4" />
          </g>
        )}
      </svg>
    </div>
  );
};
