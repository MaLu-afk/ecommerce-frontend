import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSession } from './useSession';
import { recommendationService } from '../api/recommendations';
import type { RecommendationResponse } from '../types/recommendations';

type RecommendationType = 'home' | 'product' | 'user';

interface UseRecommendationsProps {
  type: RecommendationType;
  productId?: number;
  topN?: number;
  enabled?: boolean;
}

export function useRecommendations({
  type,
  productId,
  topN = 10,
  enabled = true
}: UseRecommendationsProps) {
  const { user } = useAuth();
  const { sessionId } = useSession();
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const baseData = {
        user_id: user?.id,
        session_id: sessionId,
        top_n: topN,
      };

      let response: RecommendationResponse;

      switch (type) {
        case 'home':
          response = await recommendationService.getHomeRecommendations(baseData);
          break;
        case 'product':
          if (!productId) throw new Error('productId is required for product recommendations');
          response = await recommendationService.getProductRecommendations({
            ...baseData,
            producto_id: productId
          });
          break;
        case 'user':
          response = await recommendationService.getUserRecommendations(baseData);
          break;
        default:
          throw new Error(`Unknown recommendation type: ${type}`);
      }

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [type, productId, topN, enabled, user, sessionId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { data, loading, error, refetch: fetchRecommendations };
}