// src/components/common/ProductsCarousel.tsx
import { useState, useEffect } from "react";
import ProductCard from "../landing/ProductCard";
import type { Product } from "../../types/product";
import type { ProductoRecomendado } from "../../types/recommendations";

interface ProductsCarouselProps {
  products: Product[] | ProductoRecomendado[];
  title?: string;
  showScores?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  algorithm?: string; // Algoritmo usado para generar recomendaciones
}

/**
 * Carrusel para mostrar múltiples productos en formato grid
 * - Soporta tanto Product[] como ProductoRecomendado[]
 * - Responsive automático
 * - Tracking de clicks con métricas de conversión
 * - Auto-play opcional
 */
export function ProductsCarousel({
  products,
  title = "Productos recomendados",
  showScores = false,
  autoPlay = false,
  autoPlayInterval = 5000,
  algorithm
}: ProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Ajustar itemsPerPage según tamaño ventana
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 780) setItemsPerPage(2);
      else if (window.innerWidth < 1200) setItemsPerPage(3);
      else setItemsPerPage(5);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || products.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === Math.ceil(products.length / itemsPerPage) - 1 ? 0 : prev + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, products.length, itemsPerPage]);

  if (!products.length) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => setCurrentIndex(index);

  // Convertir productos a formato uniforme con métricas
  const normalizedProducts: (Product & {
    recommendationScore?: number;
    recommendationPosition?: number;
    recommendationAlgorithm?: string;
  })[] = products.map((product, index) => {
    // Si es ProductoRecomendado
    if ('score' in product) {
      return {
        id: product.id,
        nombre: product.nombre,
        descripcion: showScores
          ? `Producto recomendado - Score: ${(product.score * 100).toFixed(0)}%`
          : "Producto recomendado",
        precio: product.precio,
        stock: 1,
        imagen_url: product.imagen_url ? [product.imagen_url] : null,
        categoria_id: product.categoria_id,
        estado: 'activo',
        // Métricas de conversión
        recommendationScore: product.score,
        recommendationPosition: index + 1,
        recommendationAlgorithm: algorithm
      };
    }
    // Si ya es Product
    return {
      ...product,
      recommendationPosition: index + 1,
      recommendationAlgorithm: algorithm
    };
  });

  return (
    <div className="max-w-[1390px] mx-auto p-5 font-['-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto',sans-serif]">
      <h3 className="font-poppins text-2xl font-semibold text-black mb-4">{title}</h3>

      <div className="relative flex items-center gap-4">
        {/* Botón anterior */}
        <button
          className="
            bg-white border border-gray-300 rounded-full w-10 h-10 
            flex items-center justify-center cursor-pointer text-xl 
            font-bold text-gray-500 transition-all duration-200 
            flex-shrink-0 z-10 order-first
            hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 
            hover:shadow-sm active:scale-95
          "
          onClick={prevSlide}
        >
          ‹
        </button>

        {/* Contenido del carrusel */}
        <div className="flex-1 overflow-hidden">
          <div
            className="grid grid-flow-col gap-6 transition-transform duration-600 ease-in-out min-h-[300px]"
            style={{
              transform: `translateX(-${(currentIndex * 100) / totalPages}%)`,
              gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`,
              width: `${(products.length / itemsPerPage) * 100}%`,
            }}
          >
            {normalizedProducts.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer h-full"
                data-recommendation-position={product.recommendationPosition}
                data-recommendation-score={product.recommendationScore}
                data-recommendation-algorithm={product.recommendationAlgorithm}
              >
                <ProductCard
                  p={product}
                  trackingContext="recommendations"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botón siguiente */}
        <button
          className="
            bg-white border border-gray-300 rounded-full w-10 h-10 
            flex items-center justify-center cursor-pointer text-xl 
            font-bold text-gray-500 transition-all duration-200 
            flex-shrink-0 z-10 order-last
            hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 
            hover:shadow-sm active:scale-95
          "
          onClick={nextSlide}
        >
          ›
        </button>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`
              w-3 h-3 rounded-full border-none cursor-pointer 
              transition-all duration-200
              ${index === currentIndex
                ? 'bg-[#9d5b2b]'
                : 'bg-gray-300 hover:bg-gray-400'
              }
            `}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}