// src/admin/pages/VistaPreviaPage.tsx
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function VistaPreviaPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const location = useLocation();

  // Ocultar la navegación del admin cuando estemos en vista previa
  useEffect(() => {
    // Encontrar y ocultar la navegación del admin
    const adminNav = document.querySelector('.admin-navigation');
    const navTabs = document.querySelector('.nav-tabs');
    
    if (adminNav) {
      (adminNav as HTMLElement).style.display = 'none';
    }
    if (navTabs) {
      (navTabs as HTMLElement).style.display = 'none';
    }

    // Restaurar la navegación cuando se desmonte el componente
    return () => {
      if (adminNav) {
        (adminNav as HTMLElement).style.display = '';
      }
      if (navTabs) {
        (navTabs as HTMLElement).style.display = '';
      }
    };
  }, [location]);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Inyectar CSS para vista previa (solo para el contenido del iframe)
      const style = iframeDoc.createElement('style');
      style.textContent = `
        /* OCULTAR HEADER Y NAVEGACIÓN DEL CONTENIDO (dentro del iframe) */
        header,
        .sticky.top-0,
        nav,
        [data-testid="header"],
        [role="banner"],
        [class*="navigation"],
        [class*="Navigation"],
        [class*="navbar"],
        [class*="Navbar"],
        [class*="menu"],
        [class*="Menu"],
        .admin-navigation,
        .nav-tabs,
        .nav-tab,
        [class*="breadcrumb"],
        [class*="Breadcrumb"] {
          display: none !important;
        }
        
        /* Ocultar footer del contenido */
        footer,
        [data-testid="footer"],
        [role="contentinfo"] {
          display: none !important;
        }
        
        /* Ajustar márgenes del contenido principal */
        main:first-of-type,
        [role="main"]:first-of-type {
          margin-top: 0 !important;
          padding-top: 0 !important;
          min-height: 100vh !important;
        }

        body {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }

        /* DESHABILITAR BOTONES DE ACCIÓN */
        button[class*="cart"],
        button[class*="Cart"],
        [class*="add-to-cart"],
        [class*="AddToCart"],
        button:has(svg[class*="shopping-cart"]),
        button:has(svg[class*="ShoppingCart"]),
        .bg-\\[var\\(--nb-primary\\)\\],
        button.bg-\\[var\\(--nb-primary\\)\\],
        button[class*="comment"],
        button[class*="Comment"],
        button[class*="review"],
        button[class*="Review"],
        [class*="add-review"],
        [class*="AddReview"],
        [class*="add-comment"],
        [class*="AddComment"],
        button:has(svg[class*="message-circle"]),
        button:has(svg[class*="MessageCircle"]) {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          position: relative;
        }

        /* Mensaje indicativo */
        button[class*="cart"]::after,
        button[class*="Cart"]::after,
        [class*="add-to-cart"]::after,
        button[class*="comment"]::after,
        button[class*="review"]::after {
          content: " (Solo vista)" !important;
          font-size: 0.7em !important;
          opacity: 0.7 !important;
          margin-left: 4px !important;
        }
      `;
      
      iframeDoc.head.appendChild(style);

      // JavaScript para prevenir clicks
      const script = iframeDoc.createElement('script');
      script.textContent = `
        document.addEventListener('click', function(e) {
          const target = e.target;
          const button = target.closest('button');
          
          if (button && (
            button.className?.includes('cart') ||
            button.className?.includes('Cart') || 
            button.className?.includes('comment') ||
            button.className?.includes('Comment') ||
            button.className?.includes('review') ||
            button.className?.includes('Review') ||
            button.textContent?.includes('Carrito') ||
            button.textContent?.includes('Comentar') ||
            button.textContent?.includes('Reseña') ||
            button.textContent?.includes('Añadir') ||
            button.textContent?.includes('Add')
          )) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);

        document.addEventListener('submit', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, true);
      `;
      iframeDoc.head.appendChild(script);

    } catch (error) {
      console.log('No se pudo inyectar CSS/JS en el iframe:', error);
    }
  };

  return (
    <div className="h-screen w-full bg-white">
      {/* Banner informativo del admin */}
      <div className="bg-red-900 text-white p-3 text-center text-sm font-medium">
        Vista Previa - Navegación del Administrador
      </div>
      
      <iframe 
        ref={iframeRef}
        src="/"
        className="w-full h-[calc(100vh-40px)] border-0" 
        onLoad={handleIframeLoad}
      />
    </div>
  );
}