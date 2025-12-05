// src/hooks/useTracking.ts
import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSession } from './useSession';
import { trackingService, type EventType, type ContextType } from '../api/tracking';

export function useTracking() {
  const { user } = useAuth();
  const { sessionId } = useSession();

  const trackEvent = useCallback(async (
    producto_id: number,
    tipo: EventType,
    contexto?: ContextType,
    metadatos?: any 
  ) => {
    await trackingService.trackEvent({
      user_id: user?.id,
      session_id: sessionId,
      producto_id,
      tipo,
      contexto,
      metadatos 
    });
  }, [user, sessionId]);

  const trackProductView = useCallback((producto_id: number, contexto: ContextType = 'product_page') => {
    trackEvent(producto_id, 'view', contexto);
  }, [trackEvent]);

  const trackProductClick = useCallback((producto_id: number, contexto: ContextType = 'product_page') => {
    trackEvent(producto_id, 'click', contexto);
  }, [trackEvent]);

  const trackAddToCart = useCallback((producto_id: number) => {
    trackEvent(producto_id, 'add_to_cart', 'product_page');
  }, [trackEvent]);

  const trackPurchase = useCallback((producto_id: number) => {
    trackEvent(producto_id, 'purchase', 'cart');
  }, [trackEvent]);

  return {
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackPurchase,
    trackEvent
  };
}