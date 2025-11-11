
import { SubscriptionTierInfo } from '@/types/user';

export const subscriptionTiers: SubscriptionTierInfo[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    serviceAreasAllowed: 'Limited area coverage',
    features: [
      'Basic job browsing',
      'Limited access',
      'Community support',
    ],
    color: '#757575',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 5,
    annualPrice: 50,
    serviceAreasAllowed: 'Expanded regional coverage',
    features: [
      'Ad-free experience',
      'Higher job request limits',
      'Priority job assignment',
      'Email support',
    ],
    color: '#2962ff',
  },
  {
    id: 'premier',
    name: 'Premier',
    monthlyPrice: 15,
    annualPrice: 150,
    serviceAreasAllowed: 'Full city/county coverage',
    features: [
      'All Pro benefits',
      'Premium support',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom service areas',
    ],
    color: '#ffca28',
  },
];
