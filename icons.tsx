import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export const LabIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const ToxicologyIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}><path d="M20.3 6.2c.4.4.7.9.8 1.5l.5 3.5c.1.8-.5 1.6-1.3 1.6h-1.3c-.5 0-.9.4-1 .9l-.8 3.6c-.2.8-1 1.4-1.8 1.4H8.6c-.9 0-1.7-.6-1.9-1.5l-.6-3.3c-.1-.5-.5-.8-1-.8H4c-.9 0-1.6-.8-1.5-1.7L3 6.5c.1-.7.5-1.4 1-1.8"/><path d="m3.1 4.7 7.7 7.7c.4.4 1 .4 1.4 0l7.7-7.7"/><path d="M12 22v-3"/><path d="M12 4V2"/></svg>
);

export const WaterTestingIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 18a4 4 0 0 0 4-4c0-2.21-2-4-4-4s-4 1.79-4 4a4 4 0 0 0 4 4z"/><path d="M8 14c.5-1.55 1.8-3 3.5-3"/></svg>
);

export const AirTestingIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M4 14h4"/><path d="M5 18h2"/><path d="M7 14v4"/><path d="M15 12h5"/><path d="M14 16h6"/><path d="M16 12v4"/></svg>
);

export const FoodTestingIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M12 11v6"/><path d="M15 8v9"/><path d="M9 14v3"/><path d="M11 3v4"/><path d="M13 3v4"/></svg>
);

export const BellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

export const WorkshopUpdatesIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
        className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}
    >
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M3 10h18"/>
        <path d="m9 16 2 2 4-4"/>
    </svg>
);

export const CsrAnnouncementsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
        className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}
    >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M12 12c-3 0-6 2.5-6 6"/>
        <path d="M12 12c3 0 6 2.5 6 6"/>
        <path d="M12 12a2 2 0 1 0-4 0v6"/>
    </svg>
);

export const NewsletterIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
        className={cn(props.className, "icon-glow-light dark:icon-glow-dark")}
    >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M9 15h6"/>
        <path d="M9 11h6"/>
    </svg>
);

export const LaboratorySkillsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M10 10.25c.1-.25.2-.5.3-.75"/><path d="M14 14.75c-.1.25-.2.5-.3.75"/><path d="M12 6V5a2 2 0 1 0-4 0v1"/><path d="M12 6h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="m14 14-2 2-2-2"/></svg>
);
export const IndustrialHygieneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13.4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.4a2 2 0 0 0 .5 1.3L9 18v2h6v-2l2.5-3.3a2 2 0 0 0 .5-1.3Z"/><path d="m9.4 11 1.6 2.6 1.6-2.6"/><path d="M8 5h.01"/><path d="M16 5h.01"/><path d="M12 5h.01"/></svg>
);
export const EnvironmentalMonitoringIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-3.5-6V2"/><path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5.5s3.5-4 3.5-6"/><path d="M2 13h2.7a2.5 2.5 0 0 0 4.6 0H22"/><path d="M10.4 13c-.1-.6-.4-1.2-.9-1.6"/><path d="M13.6 13c.1-.6.4-1.2.9-1.6"/></svg>
);
export const CorporateSafetyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="m9 12 2 2 4-4"/></svg>
);
