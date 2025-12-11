/**
 * @fileoverview Adaptive AI Search Assistant Icon for AnaTech.
 * This SVG is designed to be theme-aware, automatically switching between
 * light and dark mode styles using CSS prefers-color-scheme.
 * It features a magnifying glass with a neural network motif, subtle gradients, and glows.
 * @see AIToolIconUsageNotes.tsx for integration details.
 */
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export const AiSearchAssistantIconAdaptive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    role="img"
    aria-labelledby="aiSearchIconTitle"
    {...props}
    className={cn(props.className)}
  >
    <title id="aiSearchIconTitle">AI Search Assistant Icon</title>
    <defs>
      <radialGradient id="light-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#EAFBFF" />
        <stop offset="100%" stopColor="#D4F3FF" />
      </radialGradient>
      <radialGradient id="dark-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#0A5C85" />
        <stop offset="100%" stopColor="#06203A" />
      </radialGradient>
      <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="drop-shadow" x="-0.2" y="-0.2" width="1.4" height="1.4">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
        <feFlood floodColor="#000" floodOpacity="0.2" result="offsetColor"/>
        <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur"/>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <style>
      {`
        .ai-icon-lens-bg { fill: url(#light-grad); }
        .ai-icon-rim { stroke: #06203A; stroke-width: 5; }
        .ai-icon-handle { stroke: #06203A; stroke-width: 6; }
        .ai-icon-node { fill: #0A5C85; }
        .ai-icon-node-accent { fill: #D4F3FF; }
        .ai-icon-connector { stroke: #0A5C85; stroke-opacity: 0.5; stroke-width: 1.5; }
        .ai-icon-glow { stroke: #03E3FF; stroke-width: 6; filter: url(#soft-glow); opacity: 0; transition: opacity 0.3s; }

        @media (prefers-color-scheme: dark) {
          .ai-icon-lens-bg { fill: url(#dark-grad); }
          .ai-icon-rim { stroke: #D4F3FF; }
          .ai-icon-handle { stroke: #D4F3FF; }
          .ai-icon-node { fill: #03E3FF; }
          .ai-icon-node-accent { fill: #EAFBFF; }
          .ai-icon-connector { stroke: #D4F3FF; stroke-opacity: 0.4; }
          .ai-icon-glow { stroke: #EAFBFF; }
        }

        svg:hover .ai-icon-glow {
            opacity: 1;
        }
      `}
    </style>

    <g filter="url(#drop-shadow)">
      {/* Glow Layer */}
      <circle cx="58" cy="58" r="40" fill="none" className="ai-icon-glow" />

      {/* Handle */}
      <line x1="88" y1="88" x2="108" y2="108" className="ai-icon-handle" strokeLinecap="round" />

      {/* Lens */}
      <circle cx="58" cy="58" r="40" className="ai-icon-lens-bg" />
      <circle cx="58" cy="58" r="40" fill="none" className="ai-icon-rim" />

      {/* Neural Network */}
      <g className="ai-icon-network">
        <path className="ai-icon-connector" fill="none" d="M 40,58 C 45,45, 60,42, 68,50" />
        <path className="ai-icon-connector" fill="none" d="M 50,72 C 65,78, 75,70, 78,60" />
        <path className="ai-icon-connector" fill="none" d="M 45,45 C 55,55, 55,65, 48,73" />
        <path className="ai-icon-connector" fill="none" d="M 70,70 C 60,60, 65,48, 75,45" />

        <circle cx="40" cy="58" r="3" className="ai-icon-node" />
        <circle cx="68" cy="50" r="4" className="ai-icon-node-accent" />
        <circle cx="50" cy="72" r="3.5" className="ai-icon-node-accent" />
        <circle cx="78" cy="60" r="3" className="ai-icon-node" />
        <circle cx="45" cy="45" r="2.5" className="ai-icon-node" />
        <circle cx="48" cy="73" r="3" className="ai-icon-node" />
        <circle cx="70" cy="70" r="2.5" className="ai-icon-node" />
        <circle cx="75" cy="45" r="3.5" className="ai-icon-node-accent" />
        <circle cx="58" cy="58" r="5" className="ai-icon-node" />
      </g>
    </g>
  </svg>
);
