
import { SubscriptionTier } from '@/types/user';

export interface FeatureAccess {
  canAccessFeature: boolean;
  reason?: string;
}

export interface TierFeatures {
  maxServiceAreas: number;
  maxJobRequests: number;
  hasAdFreeExperience: boolean;
  hasPriorityAssignment: boolean;
  hasAdvancedAnalytics: boolean;
  hasPremiumSupport: boolean;
  hasDedicatedAccountManager: boolean;
  hasCustomServiceAreas: boolean;
}

const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    maxServiceAreas: 1,
    maxJobRequests: 5,
    hasAdFreeExperience: false,
    hasPriorityAssignment: false,
    hasAdvancedAnalytics: false,
    hasPremiumSupport: false,
    hasDedicatedAccountManager: false,
    hasCustomServiceAreas: false,
  },
  pro: {
    maxServiceAreas: 5,
    maxJobRequests: 50,
    hasAdFreeExperience: true,
    hasPriorityAssignment: true,
    hasAdvancedAnalytics: false,
    hasPremiumSupport: false,
    hasDedicatedAccountManager: false,
    hasCustomServiceAreas: false,
  },
  premier: {
    maxServiceAreas: -1, // unlimited
    maxJobRequests: -1, // unlimited
    hasAdFreeExperience: true,
    hasPriorityAssignment: true,
    hasAdvancedAnalytics: true,
    hasPremiumSupport: true,
    hasDedicatedAccountManager: true,
    hasCustomServiceAreas: true,
  },
};

class FeatureAccessService {
  /**
   * Get all features for a subscription tier
   */
  getTierFeatures(tier: SubscriptionTier): TierFeatures {
    return TIER_FEATURES[tier];
  }

  /**
   * Check if a user can access a specific feature
   */
  canAccessFeature(
    userTier: SubscriptionTier,
    feature: keyof TierFeatures
  ): FeatureAccess {
    const tierFeatures = TIER_FEATURES[userTier];
    const hasAccess = tierFeatures[feature] as boolean;

    if (hasAccess) {
      return { canAccessFeature: true };
    }

    // Determine which tier is needed
    let requiredTier: SubscriptionTier = 'pro';
    if (TIER_FEATURES.pro[feature]) {
      requiredTier = 'pro';
    } else if (TIER_FEATURES.premier[feature]) {
      requiredTier = 'premier';
    }

    return {
      canAccessFeature: false,
      reason: `This feature requires the ${requiredTier.toUpperCase()} plan.`,
    };
  }

  /**
   * Check if a user can add more service areas
   */
  canAddServiceArea(
    userTier: SubscriptionTier,
    currentServiceAreas: number
  ): FeatureAccess {
    const tierFeatures = TIER_FEATURES[userTier];
    const maxAreas = tierFeatures.maxServiceAreas;

    if (maxAreas === -1) {
      return { canAccessFeature: true };
    }

    if (currentServiceAreas < maxAreas) {
      return { canAccessFeature: true };
    }

    return {
      canAccessFeature: false,
      reason: `You have reached the maximum number of service areas (${maxAreas}) for your ${userTier.toUpperCase()} plan. Upgrade to add more.`,
    };
  }

  /**
   * Check if a user can request more jobs
   */
  canRequestJob(
    userTier: SubscriptionTier,
    currentJobRequests: number
  ): FeatureAccess {
    const tierFeatures = TIER_FEATURES[userTier];
    const maxRequests = tierFeatures.maxJobRequests;

    if (maxRequests === -1) {
      return { canAccessFeature: true };
    }

    if (currentJobRequests < maxRequests) {
      return { canAccessFeature: true };
    }

    return {
      canAccessFeature: false,
      reason: `You have reached the maximum number of job requests (${maxRequests}) for your ${userTier.toUpperCase()} plan. Upgrade to request more jobs.`,
    };
  }

  /**
   * Get upgrade suggestions based on current usage
   */
  getUpgradeSuggestion(
    userTier: SubscriptionTier,
    usage: {
      serviceAreas: number;
      jobRequests: number;
    }
  ): { shouldUpgrade: boolean; reason?: string; suggestedTier?: SubscriptionTier } {
    if (userTier === 'premier') {
      return { shouldUpgrade: false };
    }

    const tierFeatures = TIER_FEATURES[userTier];

    // Check if approaching limits
    const serviceAreaUsage = tierFeatures.maxServiceAreas > 0
      ? usage.serviceAreas / tierFeatures.maxServiceAreas
      : 0;
    const jobRequestUsage = tierFeatures.maxJobRequests > 0
      ? usage.jobRequests / tierFeatures.maxJobRequests
      : 0;

    if (serviceAreaUsage >= 0.8 || jobRequestUsage >= 0.8) {
      const suggestedTier = userTier === 'free' ? 'pro' : 'premier';
      return {
        shouldUpgrade: true,
        reason: 'You are approaching your plan limits. Consider upgrading for more capacity.',
        suggestedTier,
      };
    }

    return { shouldUpgrade: false };
  }

  /**
   * Compare two tiers
   */
  compareTiers(tier1: SubscriptionTier, tier2: SubscriptionTier): number {
    const tierOrder: Record<SubscriptionTier, number> = {
      free: 0,
      pro: 1,
      premier: 2,
    };
    return tierOrder[tier1] - tierOrder[tier2];
  }

  /**
   * Check if a tier is higher than another
   */
  isHigherTier(tier1: SubscriptionTier, tier2: SubscriptionTier): boolean {
    return this.compareTiers(tier1, tier2) > 0;
  }
}

export const featureAccessService = new FeatureAccessService();
