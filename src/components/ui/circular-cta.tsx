'use client';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type OrbVariant = 'laser-ring' | 'molecule-halo';

interface CircularCtaProps {
  variant: OrbVariant;
  title: string;
  subtitle: string;
  ctaText: string;
  linkHref: string;
}

const MoleculeHalo = () => (
  <div className="absolute inset-0 cta-orb-molecule-halo">
    {[...Array(6)].map((_, i) => {
      const angle = (i / 6) * 2 * Math.PI;
      const radius = '48%'; // Relative to parent for responsiveness
      const x = `calc(50% + ${Math.cos(angle)} * ${radius} - 5px)`; // center and offset
      const y = `calc(50% + ${Math.sin(angle)} * ${radius} - 5px)`;
      return (
        <div key={i} className="absolute w-full h-full cta-orb-molecule-node">
          <div 
            className="absolute w-2.5 h-2.5 bg-accent rounded-full"
            style={{ left: x, top: y, filter: 'drop-shadow(0 0 4px hsl(var(--accent)))' }}
          />
        </div>
      );
    })}
    <div className="absolute inset-0 rounded-full border border-dashed border-accent/20" />
  </div>
);

export const CircularCta = ({ variant, title, subtitle, ctaText, linkHref }: CircularCtaProps) => {
  const isLaserRing = variant === 'laser-ring';

  return (
    <section className="py-12 md:py-20 text-center">
      <div className="container mx-auto">
        <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">{subtitle}</p>

        <div className="mt-10 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="relative group"
          >
            <Link
              href={linkHref}
              aria-label={ctaText}
              className={cn(
                'relative flex items-center justify-center rounded-full',
                'h-[150px] w-[150px] md:h-[180px] md:w-[180px]',
                'bg-gradient-to-br from-primary to-secondary text-primary-foreground',
                'shadow-2xl transition-shadow duration-300 group-hover:shadow-[0_0_40px_hsl(var(--accent)/0.5)]',
                isLaserRing && 'cta-orb-laser-ring'
              )}
            >
              {/* Inner content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                
                <span className="mt-1 font-display text-xl font-bold">{ctaText}</span>
              </div>
              
              {/* Gloss effect */}
              <div className="absolute top-0 left-0 h-1/2 w-full rounded-t-full bg-white/10 blur-xl"></div>
              
              {!isLaserRing && <MoleculeHalo />}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
