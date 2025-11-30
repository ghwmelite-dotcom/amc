import React from 'react';

export const MorphingShapes: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg width="100%" height="100%" className="absolute">
        <defs>
          <linearGradient id="morphGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0066FF" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="morphGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667EEA" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#764BA2" stopOpacity="0.03" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="20" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Morphing blob 1 */}
        <path fill="url(#morphGrad1)" filter="url(#glow)">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="
              M100,200 Q200,100 300,200 Q400,300 300,400 Q200,500 100,400 Q0,300 100,200;
              M150,150 Q300,50 400,150 Q500,250 400,350 Q300,450 200,350 Q100,250 150,150;
              M80,220 Q180,120 280,220 Q380,320 280,420 Q180,520 80,420 Q-20,320 80,220;
              M100,200 Q200,100 300,200 Q400,300 300,400 Q200,500 100,400 Q0,300 100,200
            "
          />
        </path>

        {/* Morphing blob 2 */}
        <g style={{ transform: 'translate(60%, 30%)' }}>
          <path fill="url(#morphGrad2)" filter="url(#glow)">
            <animate
              attributeName="d"
              dur="25s"
              repeatCount="indefinite"
              values="
                M200,100 Q350,50 400,200 Q450,350 300,400 Q150,450 100,300 Q50,150 200,100;
                M180,120 Q330,70 380,220 Q430,370 280,420 Q130,470 80,320 Q30,170 180,120;
                M220,80 Q370,30 420,180 Q470,330 320,380 Q170,430 120,280 Q70,130 220,80;
                M200,100 Q350,50 400,200 Q450,350 300,400 Q150,450 100,300 Q50,150 200,100
              "
            />
          </path>
        </g>

        {/* Floating circles */}
        <circle cx="10%" cy="20%" r="80" fill="url(#morphGrad1)" opacity="0.3">
          <animate
            attributeName="cy"
            values="20%;25%;20%"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="85%" cy="70%" r="60" fill="url(#morphGrad2)" opacity="0.2">
          <animate
            attributeName="cy"
            values="70%;65%;70%"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default MorphingShapes;
