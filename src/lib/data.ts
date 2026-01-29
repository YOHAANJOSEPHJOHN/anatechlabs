
import type {
  NavItem,
  Service,
  Project,
  Achievement,
  Client,
  TeamMember,
  JobOpening,
  NewsArticle,
  Workshop,
  Review,
  GalleryImage,
  FaqItem,
} from './types';
import {
  FlaskConical,
  HeartPulse,
  Wind,
  Waves,
  Beaker,
  Building,
  Factory,
  TestTube,
  HardHat,
  Biohazard,
  Thermometer,
  Microwave,
} from 'lucide-react';
import { LabIcon, ToxicologyIcon, WaterTestingIcon, AirTestingIcon, FoodTestingIcon } from '@/components/icons';

export const navMenu: NavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Services',
    href: '/services',
    description: 'Our comprehensive range of testing and monitoring services.',
  },
  {
    title: 'Projects',
    href: '/projects',
    description: 'Explore our portfolio of successful case studies.',
  },
  {
    title: 'Careers',
    href: '/careers',
    description: 'Join our team of dedicated professionals.',
  },
  {
    title: 'Contact',
    href: '/contact',
    description: 'Get in touch with us for inquiries and quotes.',
  },
];

export const heroSlides = [
    {
        title: "Precision in Science, Certainty in Safety",
        description: "AnaTech delivers state-of-the-art environmental and occupational health solutions, ensuring compliance and peace of mind.",
        alt: "Modern laboratory with scientific equipment",
        imageId: "hero-1"
    },
    {
        title: "Protecting Your Environment, Inside and Out",
        description: "From workplace air quality to environmental impact assessments, our expert team provides comprehensive monitoring services.",
        alt: "Scientist working in a clean, modern lab",
        imageId: "hero-2"
    },
    {
        title: "Your Partner in Compliance and Sustainability",
        description: "Navigate complex regulations with confidence. We provide the data and insights you need to operate responsibly and sustainably.",
        alt: "Technician handling lab samples with precision",
        imageId: "hero-3"
    }
];

export const services: Service[] = [
  // OHS
  {
    id: 'ohs-1',
    title: 'Workplace Air Monitoring',
    category: 'OHS',
    description: 'Comprehensive analysis of workplace air to identify and quantify hazardous substances, ensuring a safe breathing environment for employees.',
    icon: <Wind className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ohs-2',
    title: 'Noise Level Assessment',
    category: 'OHS',
    description: 'Measurement and mapping of workplace noise levels to prevent hearing loss and ensure compliance with occupational noise exposure standards.',
    icon: <Waves className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ohs-3',
    title: 'Chemical Exposure Testing',
    category: 'OHS',
    description: 'Personal and area monitoring for exposure to volatile organic compounds (VOCs), heavy metals, and other toxic chemicals.',
    icon: <ToxicologyIcon className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ohs-4',
    title: 'Ergonomics Assessment',
    category: 'OHS',
    description: 'Evaluation of workstations and job tasks to identify and mitigate risks of musculoskeletal disorders.',
    icon: <HardHat className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ohs-5',
    title: 'Biological Hazard Monitoring',
    category: 'OHS',
    description: 'Testing for bacteria, mold, and other biological agents in workplaces like hospitals and research labs.',
    icon: <Biohazard className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
   {
    id: 'ohs-6',
    title: 'Thermal Stress Analysis',
    category: 'OHS',
    description: 'Assessing heat and cold stress in the workplace to protect employees from temperature-related illnesses.',
    icon: <Thermometer className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  // EHS
  {
    id: 'ehs-1',
    title: 'Water Quality Testing',
    category: 'EHS',
    description: 'Full-panel testing of ground, surface, and wastewater for pollutants, contaminants, and quality parameters.',
    icon: <WaterTestingIcon className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ehs-2',
    title: 'Ambient Air Quality Monitoring',
    category: 'EHS',
    description: 'Monitoring of outdoor air for pollutants like PM2.5, SOx, NOx, and ozone to assess environmental health.',
    icon: <AirTestingIcon className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ehs-3',
    title: 'Soil Contamination Analysis',
    category: 'EHS',
    description: 'Analysis of soil samples for heavy metals, pesticides, and other contaminants to guide remediation efforts.',
    icon: <Beaker className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ehs-4',
    title: 'Food & Beverage Testing',
    category: 'EHS',
    description: 'Microbiological and chemical analysis of food products to ensure safety, quality, and regulatory compliance.',
    icon: <FoodTestingIcon className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
  {
    id: 'ehs-5',
    title: 'Industrial Effluent Testing',
    category: 'EHS',
    description: 'Characterization of industrial wastewater to ensure compliance with discharge permits and environmental regulations.',
    icon: <Factory className="h-8 w-8 text-secondary" />,
    cataloguePdf: '#',
    elementsPdf: '#',
  },
];

export const projects: Project[] = [
  {
    id: 'pharma-manufacturing-safety-overhaul',
    title: 'Pharma Manufacturing Safety Overhaul',
    category: 'Occupational Health & Safety',
    location: 'Mumbai, India',
    year: 2023,
    description: 'A comprehensive OHS assessment for a leading pharmaceutical plant to reduce chemical exposure and improve air quality.',
    imageId: 'project-1',
    content: {
      challenge: 'The client faced challenges in meeting stringent international safety standards for airborne solvent concentrations in their primary manufacturing unit. High levels of specific VOCs were a concern for employee health and regulatory compliance.',
      solution: 'AnaTech deployed a multi-faceted strategy including continuous real-time air monitoring, personal dosimeter testing for over 50 employees, and a thorough ventilation system audit. We used advanced gas chromatography-mass spectrometry (GC-MS) for precise substance identification.',
      results: [
        'Reduced average airborne solvent concentration by 65%.',
        'Achieved 100% compliance with international safety thresholds.',
        'Implemented a new, more efficient ventilation protocol saving 15% on energy costs.',
        'Provided a data-driven roadmap for ongoing safety management.',
      ],
      imageIds: ['project-detail-1', 'project-detail-2']
    }
  },
  {
    id: 'river-ecosystem-health-assessment',
    title: 'River Ecosystem Health Assessment',
    category: 'Environmental Monitoring',
    location: 'Yamuna River Basin',
    year: 2022,
    description: 'A large-scale water quality monitoring project to assess the impact of industrial discharge on a major river ecosystem.',
    imageId: 'project-2',
    content: {
      challenge: 'Local authorities needed a comprehensive report on the health of the river ecosystem, focusing on heavy metal contamination and biological oxygen demand (BOD) from nearby industrial zones.',
      solution: 'Our team established 20 sampling stations along a 50km stretch of the river. We conducted monthly water and sediment analysis for a full year, testing for a wide array of chemical and biological parameters using ICP-MS and automated BOD analyzers.',
      results: [
        'Identified three major industrial pollution hotspots.',
        'Created a detailed contamination map that guided regulatory action.',
        'Provided critical data for a government-led river cleanup initiative.',
        'Developed a predictive model for seasonal pollution variations.',
      ],
      imageIds: ['project-detail-3', 'project-detail-4']
    }
  },
  {
    id: 'tech-park-ergonomics-program',
    title: 'Tech Park Ergonomics Program',
    category: 'Occupational Health & Safety',
    location: 'Bangalore, India',
    year: 2023,
    description: 'An ergonomics improvement program for a major IT tech park, aimed at reducing musculoskeletal disorders among office workers.',
    imageId: 'project-3',
    content: {
      challenge: 'The client, a large tech park managing over 10,000 employees, reported a significant increase in employee complaints related to back pain, neck strain, and carpal tunnel syndrome.',
      solution: 'AnaTech\'\'s ergonomists conducted on-site assessments for 500+ workstations, ran employee workshops on proper posture and workplace setup, and analyzed job task workflows. We used sensor-based posture tracking technology for high-risk groups.',
      results: [
        'Reduced reported musculoskeletal discomfort by 40% within six months.',
        'Provided standardized guidelines for workstation setup across the tech park.',
        'Trained 50 internal "Ergo-Champions" to sustain the program.',
        'Demonstrated a positive ROI through reduced absenteeism and increased productivity.',
      ],
      imageIds: ['project-detail-5', 'project-detail-6']
    }
  },
  {
    id: 'food-processing-pathogen-control',
    title: 'Food Processing Pathogen Control',
    category: 'Environmental Monitoring',
    location: 'Gujarat, India',
    year: 2022,
    description: 'Implemented a proactive pathogen monitoring system for a large-scale food processing facility to ensure food safety.',
    imageId: 'project-4',
    content: {
        challenge: 'A major food exporter needed to enhance their food safety protocols to meet strict international import standards, particularly concerning Salmonella and Listeria monocytogenes on processing surfaces.',
        solution: 'AnaTech designed and implemented a comprehensive environmental monitoring program (EMP). This involved ATP testing for surface cleanliness, regular swabbing of food contact and non-contact surfaces, and PCR-based analysis for rapid pathogen detection.',
        results: [
            'Achieved a 99.5% reduction in positive pathogen tests on critical surfaces.',
            'Enabled the client to gain certification for export to the European Union.',
            'Reduced product testing turnaround time by 50% with on-site rapid testing methods.',
            'Created a dynamic cleaning protocol that adjusts based on real-time monitoring data.',
        ],
        imageIds: ['project-detail-7', 'project-detail-8']
    }
  }
];

export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'ISO/IEC 17025:2017',
    description: 'Accredited for technical competence in testing and calibration laboratories.',
    imageId: 'achievement-1',
    type: 'Accreditation',
  },
  {
    id: 'ach-2',
    title: 'NABL Accreditation',
    description: 'Recognized by the National Accreditation Board for Testing and Calibration Laboratories.',
    imageId: 'achievement-2',
    type: 'Accreditation',
  },
  {
    id: 'ach-3',
    title: 'Green Innovation Award 2023',
    description: 'Awarded for our innovative approach to sustainable industrial effluent testing.',
    imageId: 'achievement-3',
    type: 'Award',
  },
  {
    id: 'ach-4',
    title: 'Top Environmental Consulting Firm',
    description: 'Named one of the top 10 environmental consulting firms by India Business Journal.',
    imageId: 'achievement-4',
    type: 'Award',
  },
  {
    id: 'ach-5',
    title: 'Collaboration with EnviroSafe Global',
    description: 'Partnered with EnviroSafe Global to advance research in air quality monitoring technology.',
    imageId: 'achievement-5',
    type: 'Collaboration',
  },
   {
    id: 'ach-6',
    title: 'FSSAI Recognition',
    description: 'Recognized by the Food Safety and Standards Authority of India for food testing.',
    imageId: 'achievement-6',
    type: 'Accreditation',
  },
];

export const clients: Client[] = [
  { id: 'client-1', name: 'Adani', logoId: 'logo-1' },
  { id: 'client-2', name: 'AM/NS India', logoId: 'logo-2' },
  { id: 'client-3', name: 'Coal India Limited', logoId: 'logo-3' },
  { id: 'client-4', name: 'Hutty Gold Mines', logoId: 'logo-4' },
  { id: 'client-5', name: 'JSLA', logoId: 'logo-5' },
  { id: 'client-6', name: 'JSW', logoId: 'logo-6' },
  { id: 'client-7', name: 'Karnataka Industrial Area Development', logoId: 'logo-7' },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dr. Arin Kapoor',
    role: 'Founder & Chief Scientific Officer',
    bio: 'With over 25 years of experience in environmental science, Dr. Kapoor leads our research and development, driving innovation in testing methodologies.',
    imageId: 'team-1',
  },
  {
    id: 'team-2',
    name: 'Priya Sharma',
    role: 'Head of Laboratory Operations',
    bio: 'Priya manages all laboratory operations, ensuring efficiency, accuracy, and compliance across all our testing facilities. Her expertise is in quality control.',
    imageId: 'team-2',
  },
  {
    id: 'team-3',
    name: 'Rohan Desai',
    role: 'Director, Occupational Health & Safety',
    bio: 'Rohan is a certified industrial hygienist and leads our OHS division, helping clients create safer and healthier work environments.',
    imageId: 'team-3',
  },
  {
    id: 'team-4',
    name: 'Anjali Mehta',
    role: 'Lead Environmental Scientist',
    bio: 'Anjali specializes in water and soil contamination analysis. She has led several large-scale environmental impact assessment projects.',
    imageId: 'team-4',
  },
];

export const jobOpenings: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Senior Laboratory Analyst',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: 'Seeking an experienced analyst to perform complex chemical and biological tests. Master\'\'s degree in Chemistry or related field and 5+ years of experience required.',
  },
  {
    id: 'job-2',
    title: 'Field Technician - Air Quality',
    location: 'Delhi, India',
    type: 'Full-time',
    description: 'Responsible for collecting air quality samples, and maintaining monitoring equipment. Bachelor\'\'s degree in Environmental Science preferred.',
  },
  {
    id: 'job-3',
    title: 'Sales & Business Development Manager',
    location: 'Bangalore, India',
    type: 'Full-time',
    description: 'Drive business growth by identifying new clients and markets for our OHS and EHS services. Proven track record in B2B sales in a related industry is essential.',
  },
];

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'AnaTech Develops New Rapid Test for Water Contaminants',
    excerpt: 'Our R&D team has successfully developed a new on-site testing kit that can detect heavy metals in water in under 15 minutes...',
    date: '2023-10-26',
    imageId: 'news-1',
  },
  {
    id: 'news-2',
    title: 'The Importance of Proactive Ergonomics in the Modern Workplace',
    excerpt: 'As workplaces evolve, so do the health challenges. Our latest whitepaper discusses the critical role of proactive ergonomics...',
    date: '2023-09-15',
    imageId: 'news-2',
  },
  {
    id: 'news-3',
    title: 'AnaTech Expands Operations with New Lab in Chennai',
    excerpt: 'We are thrilled to announce the opening of our new state-of-the-art laboratory in Chennai, expanding our capacity and reach...',
    date: '2023-08-01',
    imageId: 'news-3',
  },
];

export const workshops: Workshop[] = [
  {
    id: 'workshop-1',
    title: 'Advanced HAZOP Leadership',
    description: 'A 2-day workshop for EHS professionals on leading Hazard and Operability studies effectively.',
    imageId: 'workshop-1',
  },
  {
    id: 'workshop-2',
    title: 'Laboratory Quality Management (ISO 17025)',
    description: 'Deep dive into the requirements of ISO 17025 and learn how to implement a robust quality management system.',
    imageId: 'workshop-2',
  },
  {
    id: 'workshop-3',
    title: 'Fundamentals of Industrial Hygiene',
    description: 'An introductory course for safety officers and managers on the principles of anticipating, recognizing, evaluating, and controlling workplace hazards.',
    imageId: 'workshop-3',
  },
];

export const reviews: Review[] = [
  {
    id: 'review-1',
    name: 'Sarah Johnson',
    role: 'Environmental Manager',
    company: 'EcoCorp',
    review: "AnaTech's expertise and professionalism are unmatched. They delivered precise results ahead of schedule, enabling us to meet our compliance goals effortlessly.",
    rating: 5,
    imageId: 'client-avatar-1',
  },
  {
    id: 'review-2',
    name: 'Raj Patel',
    role: 'Plant Manager',
    company: 'Fusion Chemicals',
    review: 'The OHS team was incredibly thorough. Their assessment identified critical areas for improvement that we had overlooked. Our workplace is significantly safer now.',
    rating: 5,
    imageId: 'client-avatar-2',
  },
  {
    id: 'review-3',
    name: 'Li Wei',
    role: 'Quality Assurance Director',
    company: 'Global Foods Inc.',
    review: 'We rely on AnaTech for all our product safety testing. Their reports are detailed, reliable, and always delivered on time. They are a true partner.',
    rating: 5,
    imageId: 'client-avatar-3',
  },
  {
    id: 'review-4',
    name: 'David Chen',
    role: 'Project Director',
    company: 'Apex Construction',
    review: 'The environmental impact assessment they conducted for our new project was comprehensive and instrumental in securing our permits. Excellent service from start to finish.',
    rating: 4,
    imageId: 'client-avatar-4',
  },
];

export const galleryImages: GalleryImage[] = [
  { id: 'gallery-1', caption: 'Gas Chromatography-Mass Spectrometry (GC-MS) unit', category: 'Labs', imageId: 'gallery-labs-1' },
  { id: 'gallery-2', caption: 'Our microbiology team at work', category: 'Teams', imageId: 'gallery-teams-1' },
  { id: 'gallery-3', caption: 'Industrial Hygiene workshop in session', category: 'Workshops', imageId: 'gallery-workshops-1' },
  { id: 'gallery-5', caption: 'Atomic Absorption Spectrophotometer (AAS)', category: 'Labs', imageId: 'gallery-labs-2' },
  { id: 'gallery-6', caption: 'Field technicians calibrating air monitoring equipment', category: 'Teams', imageId: 'gallery-teams-2' },
  { id: 'gallery-8', caption: 'Annual company offsite event', category: 'Events', imageId: 'gallery-events-2' },
  { id: 'gallery-9', caption: 'Cleanroom for sensitive sample preparation', category: 'Labs', imageId: 'gallery-labs-3' },
  { id: 'gallery-10', caption: 'Water sampling on the Yamuna river', category: 'Teams', imageId: 'gallery-teams-3' },
];

export const faqData: FaqItem[] = [
    {
        question: "What industries do you serve?",
        answer: "We serve a wide range of industries including pharmaceutical, manufacturing, information technology, construction, food & beverage, and government agencies. Our services are adaptable to meet the specific needs of each sector."
    },
    {
        question: "What are your laboratory's accreditations?",
        answer: "Our laboratories are accredited under ISO/IEC 17025:2017 and are recognized by the National Accreditation Board for Testing and Calibration Laboratories (NABL). We also hold specific recognitions from bodies like FSSAI for food testing."
    },
    {
        question: "How long does it take to get test results?",
        answer: "Turnaround time varies depending on the complexity of the test. Standard water quality reports are typically available within 5-7 business days, while more complex chemical analyses may take up to 14 days. We also offer expedited services for urgent needs."
    },
    {
        question: "Can you help with regulatory compliance?",
        answer: "Absolutely. A core part of our service is helping clients navigate and comply with national and international regulations. We provide the data, reporting, and expert consultation needed to meet your legal and safety obligations."
    },
    {
        question: "Do you offer on-site services?",
        answer: "Yes, many of our services, such as air and noise monitoring, ergonomic assessments, and water sample collection, are performed on-site at your facility. Our field technicians are highly trained and equipped to conduct these services efficiently and with minimal disruption."
    },
];


    
