import type { ProviderItem } from '../components/services/ProviderCard';

export const mockProviders: ProviderItem[] = [
  {
    id: 'sp-001',
    name: 'SunPeak Solar Solutions',
    city: 'Bangalore',
    avg_rating: 4.6,
    certifications: ['MNRE', 'ISO 9001'],
    image: '/pexels-photo-433308.avif',
  },
  {
    id: 'sp-002',
    name: 'GreenSpark Energy',
    city: 'Hyderabad',
    avg_rating: 4.2,
    certifications: ['ISO 14001'],
    image: '/pexels-photo-371917.jpeg',
  },
  {
    id: 'sp-003',
    name: 'Radiant Roofs',
    city: 'Bangalore',
    avg_rating: 4.8,
    certifications: ['MNRE', 'ISO 9001', 'ISO 14001'],
    image: '',
  },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: `sp-x-${i}`,
    name: `SolarCo ${i + 1}`,
    city: i % 2 === 0 ? 'Bangalore' : 'Chennai',
    avg_rating: 3.5 + (i % 5) * 0.3,
    certifications: i % 3 === 0 ? ['MNRE'] : ['ISO 9001'],
    image: '',
  })),
];


