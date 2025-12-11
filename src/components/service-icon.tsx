
'use client';
import {
    Beaker,
    HeartPulse,
    ShieldAlert,
    HardHat,
    Wind,
    AreaChart,
    Grid,
    TestTubes,
} from 'lucide-react';
import { ToxicologyIcon, WaterTestingIcon, FoodTestingIcon } from '@/components/icons';
import { SVGProps } from 'react';

const iconMap: { [key: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element } = {
    'heavy-metals': Beaker,
    'toxicology': ToxicologyIcon,
    'voc': Wind,
    'tdm': HeartPulse,
    'doa': ShieldAlert,
    'industrial-hygiene': HardHat,
    'water-quality': WaterTestingIcon,
    'food-safety': FoodTestingIcon,
    'environmental-monitoring': AreaChart,
    'hygiene-testing': Grid,
    'contaminant-analysis': TestTubes,
    'purity-testing': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-3.5-6V2"/><path d="M10.5 4.5 12 2l1.5 2.5"/><path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5.5s3.5-4 3.5-6"/><path d="m15 9-.5-1"/><path d="m9 9 .5-1"/><path d="M12 6h.01"/></svg>,
    'impurity-profiling': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
    'pathogens': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="8"/><path d="M12 12h.01"/><path d="M12 8h.01"/><path d="M12 16h.01"/><path d="M8 12h.01"/><path d="M16 12h.01"/><path d="m9.4 9.4.01.01"/><path d="m14.6 14.6.01.01"/><path d="m9.4 14.6.01-.01"/><path d="m14.6 9.4-.01.01"/></svg>,
    'toxins': (props) => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m8.5 2.7 4 4.1 4-4.1M12 16.5V22"/><path d="M7 16.5h10"/><path d="M12 2.2c2.3 1.3 4.2 3.1 5.5 5.3m-11 0c1.3-2.2 3.2-4 5.5-5.3"/><path d="M4.2 11c-1.6.5-2.6 1.4-3 2.5 1.2 2.5 4 4 7.8 4s6.6-1.5 7.8-4c-.4-1.1-1.4-2-3-2.5"/><path d="M12 13.5V11c0-1-1-2-1-2h-1"/></svg>,
};

export const ServiceIcon = ({ iconName, ...props }: { iconName: string } & SVGProps<SVGSVGElement>) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) {
        return null; 
    }
    return <IconComponent {...props} />;
};
