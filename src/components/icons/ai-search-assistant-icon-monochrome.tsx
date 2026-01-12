/**
 * @fileoverview Monochrome Fallback AI Search Assistant Icon.
 * A tiny, single-path, currentColor-based version for small UI elements,
 * favicons, or anywhere a simplified icon is needed.
 * @see AIToolIconUsageNotes.tsx for integration details.
 */
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export const AiSearchAssistantIconMonochrome = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-labelledby="aiSearchIconMonoTitle"
    {...props}
    className={cn(props.className)}
  >
    <title id="aiSearchIconMonoTitle">AI Search Assistant Icon (Monochrome)</title>
    <path d="M11 19A8 8 0 1 0 3 11a8 8 0 0 0 8 8zM21 21l-4.3-4.3M11 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11 8v0M14 14v0" />
  </svg>
);
