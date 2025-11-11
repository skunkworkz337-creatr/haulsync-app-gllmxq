
import { useMemo } from 'react';
import { featureAccessService, FeatureAccess, TierFeatures } from '@/services/featureAccessService';
import { SubscriptionTier } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { Hauler } from '@/types/user';

export function useFeatureAccess() {
  const { user } = useAuth();

  const userTier: SubscriptionTier = useMemo(() => {
    if (user?.role === 'hauler') {
      return (user as Hauler).subscriptionTier || 'free';
    }
    return 'free';
  }, [user]);

  const tierFeatures: TierFeatures = useMemo(() => {
    return featureAccessService.getTierFeatures(userTier);
  }, [userTier]);

  const canAccessFeature = (feature: keyof TierFeatures): FeatureAccess => {
    return featureAccessService.canAccessFeature(userTier, feature);
  };

  const canAddServiceArea = (currentServiceAreas: number): FeatureAccess => {
    return featureAccessService.canAddServiceArea(userTier, currentServiceAreas);
  };

  const canRequestJob = (currentJobRequests: number): FeatureAccess => {
    return featureAccessService.canRequestJob(userTier, currentJobRequests);
  };

  const getUpgradeSuggestion = (usage: { serviceAreas: number; jobRequests: number }) => {
    return featureAccessService.getUpgradeSuggestion(userTier, usage);
  };

  const isHigherTier = (tier: SubscriptionTier): boolean => {
    return featureAccessService.isHigherTier(tier, userTier);
  };

  return {
    userTier,
    tierFeatures,
    canAccessFeature,
    canAddServiceArea,
    canRequestJob,
    getUpgradeSuggestion,
    isHigherTier,
  };
}
