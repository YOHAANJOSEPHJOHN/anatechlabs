
export interface SSPService {
    name: string;
    price: number;
    tat: string; // Turnaround Time, e.g., "5-7 Business Days"
}

export interface SSPServiceCategory {
    name: string;
    services: SSPService[];
}

export const serviceCategories: SSPServiceCategory[] = [
    {
        name: "Occupational Health & Safety",
        services: [
            { name: "Heavy Metals Testing Laboratory", price: 3500, tat: "5-7 Business Days" },
            { name: "Poison & Toxicology Screening Lab", price: 5000, tat: "7-10 Business Days" },
            { name: "Volatile Organic Compounds (VOC) Analysis Lab", price: 4500, tat: "5-7 Business Days" },
            { name: "Therapeutic Drug Monitoring (TDM) Laboratory", price: 3000, tat: "3-5 Business Days" },
            { name: "Drugs of Abuse (DOA) Testing Center", price: 2500, tat: "2-3 Business Days" },
            { name: "Occupational Exposure & Industrial Hygiene Lab", price: 6000, tat: "7-10 Business Days" },
        ],
    },
    {
        name: "Environmental Health & Safety",
        services: [
            { name: "Water Quality Testing Laboratory", price: 2000, tat: "3-5 Business Days" },
            { name: "Food Safety & Microbiology Testing Lab", price: 4000, tat: "5-7 Business Days" },
            { name: "Environmental Monitoring & Pollution Analysis Lab", price: 7500, tat: "10-14 Business Days" },
            { name: "Surface, Swab & Hygiene Testing Laboratory", price: 1500, tat: "2-3 Business Days" },
            { name: "Microbial & Chemical Contaminant Analysis Lab", price: 5500, tat: "7-10 Business Days" },
        ],
    },
    {
        name: "Product Testing & Certifications",
        services: [
            { name: "Purity Testing", price: 4000, tat: "5-7 Business Days" },
            { name: "Impurity Profiling", price: 6500, tat: "7-10 Business Days" },
            { name: "Pathogens", price: 3000, tat: "3-5 Business Days" },
            { name: "Toxins", price: 4500, tat: "5-7 Business Days" },
        ],
    },
];

export const industries = ["Food", "Pharma", "Cosmetics", "Chemical", "Electronics", "Other"];
export const classifications = ["B2B", "B2C", "Individual"];
export const countries = ["India", "USA", "UK", "Germany", "Japan", "Other"];
export const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other"];
