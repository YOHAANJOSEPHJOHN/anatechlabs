
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ElementType;
  label?: string;
};

export type NavItemWithChildren = NavItem & {
  items: NavItemWithChildren[];
};

export type MainNavItem = NavItem;

export type SidebarNavItem = NavItemWithChildren;

export type Service = {
  id: string;
  title: string;
  category: 'OHS' | 'EHS' | 'Product Testing';
  description: string;
  icon: React.ElementType;
  cataloguePdf: string;
  elementsPdf: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: number;
  description: string;
  imageId: string;
  content: {
    challenge: string;
    solution: string;
    results: string[];
    imageIds: string[];
  };
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  imageId: string;
  type: 'Accreditation' | 'Award' | 'Collaboration';
};

export type Client = {
  id: string;
  name: string;
  logoId: string;
  testimonial?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageId: string;
};

export type JobOpening = {
  id: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageId: string;
};

export type Workshop = {
  id: string;
  title: string;
  description: string;
  imageId: string;
};

export type Review = {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  rating: number;
  imageId: string;
};

export type GalleryImage = {
  id: string;
  caption: string;
  category: 'Labs' | 'Teams' | 'Workshops' | 'Events';
  imageId: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

// Types for Sample Submission Portal
export interface SSPService {
  name: string;
  price: number;
  tat: string; // Turnaround Time, e.g., "5-7 Business Days"
}

export interface SSPServiceCategory {
    name: string;
    services: SSPService[];
}
