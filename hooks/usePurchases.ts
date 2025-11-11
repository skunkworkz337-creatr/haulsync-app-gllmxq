
import { useState, useEffect } from 'react';
import { purchaseService, PurchaseProduct } from '@/services/purchaseService';
import { SubscriptionTier } from '@/types/user';

export function usePurchases() {
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePurchases();

    return () => {
      purchaseService.disconnect();
    };
  }, []);

  const initializePurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      await purchaseService.initialize();
      const loadedProducts = await purchaseService.loadProducts();
      setProducts(loadedProducts);
    } catch (err: any) {
      console.log('Error initializing purchases:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const purchaseProduct = async (productId: string): Promise<boolean> => {
    try {
      setError(null);
      return await purchaseService.purchaseProduct(productId);
    } catch (err: any) {
      console.log('Error purchasing product:', err);
      setError(err.message || 'Purchase failed');
      return false;
    }
  };

  const restorePurchases = async (): Promise<void> => {
    try {
      setError(null);
      await purchaseService.restorePurchases();
    } catch (err: any) {
      console.log('Error restoring purchases:', err);
      setError(err.message || 'Failed to restore purchases');
    }
  };

  const getProductPrice = (tier: SubscriptionTier, billingPeriod: 'monthly' | 'annual'): string => {
    return purchaseService.getProductPrice(tier, billingPeriod);
  };

  return {
    products,
    loading,
    error,
    purchaseProduct,
    restorePurchases,
    getProductPrice,
  };
}
