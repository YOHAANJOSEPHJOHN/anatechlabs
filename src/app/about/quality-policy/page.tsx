import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldCheck, Award, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const policyPoints = [
  {
    title: 'Commitment to Excellence',
    description: 'AnaTech is committed to achieving the highest standards of quality in all its testing, monitoring, and consulting services.',
  },
  {
    title: 'Client Satisfaction',
    description: 'We strive to consistently meet and exceed client expectations by delivering accurate, reliable, and timely results.',
  },
  {
    title: 'Regulatory Compliance',
    description: 'We ensure that all our activities comply with relevant national and international standards, regulations, and statutory requirements.',
  },
  {
    title: 'Continuous Improvement',
    description: 'We are dedicated to the continual improvement of our Quality Management System (QMS) and services through regular reviews, training, and technological upgrades.',
  },
  {
    title: 'Personnel Competence',
    description: 'We ensure all personnel are competent, qualified, and trained to perform their assigned duties, promoting a culture of quality throughout the organization.',
  },
  {
    title: 'Scientific Integrity',
    description: 'We maintain impartiality, confidentiality, and integrity in all our scientific operations, ensuring that results are unbiased and trustworthy.',
  },
];

const qualityIcons = [
    { icon: <ShieldCheck className="h-10 w-10 text-secondary" />, label: 'Compliance' },
    { icon: <Award className="h-10 w-10 text-secondary" />, label: 'Accreditation' },
    { icon: <FlaskConical className="h-10 w-10 text-secondary" />, label: 'Quality' },
]

export default function QualityPolicyPage() {
  const bannerImage = PlaceHolderImages.find(p => p.id === 'quality-banner');

  return (
    <>
      <section className="relative h-[30vh] md:h-[40vh] w-full">
        {bannerImage && (
             <Image
                src={bannerImage.imageUrl}
                alt="Abstract image representing quality"
                fill
                className="object-cover"
                data-ai-hint={bannerImage.imageHint}
                priority
              />
        )}
        <div className="absolute inset-0 bg-primary/80" />
        <div className="container mx-auto absolute inset-0 flex flex-col items-center justify-center text-center text-primary-foreground p-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
                Our Commitment to Quality
            </h1>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto max-w-4xl text-center">
            <div className="grid grid-cols-3 gap-8 mb-12">
                {qualityIcons.map(item => (
                    <div key={item.label} className="flex flex-col items-center">
                        <div className="bg-secondary/10 p-4 rounded-full">{item.icon}</div>
                        <p className="mt-2 font-semibold text-foreground/80">{item.label}</p>
                    </div>
                ))}
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              AnaTech Quality Policy Statement
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
                AnaTech is dedicated to providing environmental and occupational health services of the highest quality. Our policy is to ensure total client satisfaction by adhering to established scientific methods, regulatory standards, and a robust Quality Management System based on ISO/IEC 17025. We are committed to a culture of continuous improvement, scientific integrity, and professional excellence.
            </p>
        </div>
      </section>

      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policyPoints.map((point, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-3">
                  <span className="text-secondary font-bold text-2xl">{`0${index + 1}`}</span>
                  {point.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
