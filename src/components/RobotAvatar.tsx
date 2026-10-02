import React from 'react';
import { PlayerRobotCustomization } from '../../shared/types';

interface RobotAvatarProps {
  customization?: PlayerRobotCustomization;
  size?: number;
  className?: string;
  isHit?: boolean;
  isDefeated?: boolean;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  customization = { color: '#38bdf8', headType: 'antenna', expression: 'determined' },
  size = 64,
  className = '',
  isHit = false,
  isDefeated = false,
}) => {
  const { color, headType, expression } = customization;

  return (
    <div
      className={`relative inline-block transition-transform duration-200 ${
        isHit ? 'animate-bounce filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' : ''
      } ${isDefeated ? 'opacity-50 grayscale' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-md select-none"
      >
        {/* Antennas / Headgear */}
        {headType === 'antenna' && (
          <g>
            <line x1="50" y1="26" x2="50" y2="10" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="8" r="6" fill="#facc15" className="animate-pulse" />
            <circle cx="50" cy="8" r="8" fill="#facc15" opacity="0.3" className="animate-ping" />
          </g>
        )}
        {headType === 'radar' && (
          <g>
            <line x1="50" y1="26" x2="50" y2="14" stroke="#94a3b8" strokeWidth="4" />
            <path d="M 38 12 Q 50 4 62 12" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="50" cy="12" r="3" fill="#38bdf8" />
          </g>
        )}
        {headType === 'bolt' && (
          <g>
            <path
              d="M 47 4 L 54 4 L 49 14 L 56 14 L 46 26 L 49 18 L 44 18 Z"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
          </g>
        )}
        {headType === 'visor' && (
          <g>
            <rect x="36" y="16" width="28" height="9" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
            <line x1="42" y1="20" x2="58" y2="20" stroke="#06b6d4" strokeWidth="2" />
          </g>
        )}

        {/* Ears / Side Bolts */}
        <rect x="18" y="42" width="6" height="14" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
        <rect x="76" y="42" width="6" height="14" rx="2" fill="#64748b" stroke="#1e293b" strokeWidth="2" />

        {/* Robot Head Chassis */}
        <rect
          x="24"
          y="26"
          width="52"
          height="48"
          rx="12"
          fill={color}
          stroke="#0f172a"
          strokeWidth="4"
        />

        {/* Visor Screen Background */}
        <rect
          x="30"
          y="34"
          width="40"
          height="24"
          rx="6"
          fill="#090d16"
          stroke="#1e293b"
          strokeWidth="2"
        />

        {/* Expressions / Eyes */}
        {expression === 'determined' && (
          <g>
            {/* Angled cool eyes */}
            <path d="M 35 41 L 46 45 L 35 46 Z" fill="#38bdf8" />
            <path d="M 65 41 L 54 45 L 65 46 Z" fill="#38bdf8" />
            {/* Small smile */}
            <line x1="45" y1="52" x2="55" y2="52" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {expression === 'happy' && (
          <g>
            {/* Arched happy eyes */}
            <path d="M 35 45 Q 41 38 47 45" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            <path d="M 53 45 Q 59 38 65 45" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            {/* Open mouth */}
            <path d="M 44 50 Q 50 55 56 50" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {expression === 'fierce' && (
          <g>
            {/* Angry slants */}
            <polygon points="35,40 47,46 37,48" fill="#f43f5e" />
            <polygon points="65,40 53,46 63,48" fill="#f43f5e" />
            <path d="M 43 53 L 47 50 L 51 53 L 55 50 L 57 53" fill="none" stroke="#f43f5e" strokeWidth="2" />
          </g>
        )}
        {expression === 'cool' && (
          <g>
            {/* Sunglasses / Visor line */}
            <rect x="33" y="40" width="34" height="8" rx="2" fill="#a855f7" />
            <line x1="33" y1="44" x2="67" y2="44" stroke="#e879f9" strokeWidth="1.5" />
            <line x1="46" y1="52" x2="54" y2="52" stroke="#a855f7" strokeWidth="2" />
          </g>
        )}

        {/* Neck / Collar */}
        <rect x="42" y="74" width="16" height="6" fill="#475569" stroke="#0f172a" strokeWidth="2" />

        {/* Body Chassis */}
        <path
          d="M 30 80 L 70 80 L 76 96 L 24 96 Z"
          fill={color}
          stroke="#0f172a"
          strokeWidth="3.5"
        />

        {/* Chest micro:bit mini badge */}
        <rect x="44" y="83" width="12" height="9" rx="1.5" fill="#1e293b" stroke="#facc15" strokeWidth="1" />
        <circle cx="47" cy="87.5" r="1" fill="#ef4444" />
        <circle cx="53" cy="87.5" r="1" fill="#ef4444" />
      </svg>
    </div>
  );
};
