// src/components/details/description.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import type { ProductData } from "../../types/productDetail";
import { useCart } from "../../hooks/useCart";

interface ProductDetailProps {
  product: ProductData;
}

/**
 * Componente principal de detalle del producto
 * Muestra imágenes, información, características y sistema de reseñas
 */
const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    setShowConfirmModal(true);
  };

  const confirmAddToCart = async () => {
    setShowConfirmModal(false);
    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      navigate("/cart");
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const cancelAddToCart = () => {
    setShowConfirmModal(false);
  };

  return (
    <div>
      {/* GALERÍA Y INFORMACIÓN DEL PRODUCTO */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 max-w-[1300px] mx-auto p-6 font-sans">

        {/* Sección Izquierda: Imágenes */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row gap-4 items-start">

            {/* Miniaturas */}
            <div className="flex flex-row lg:flex-col gap-2.5 lg:w-[100px] order-2 lg:order-1">
              {product.imagen_url?.map((image, index) => (
                <div
                  key={index}
                  className={`w-[70px] lg:w-[80px] h-[70px] lg:h-[80px] border-2 rounded-lg cursor-pointer overflow-hidden transition-all duration-250 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:border-accent-blue hover:scale-[1.07] ${index === selectedImageIndex
                    ? "border-accent-orange"
                    : "border-transparent"
                    }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.nombre} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Imagen principal y datos */}
            <div className="flex-1 w-full order-1 lg:order-2">
              <img
                src={product.imagen_url?.[selectedImageIndex] ?? ""}
                alt={product.nombre}
                className="w-full h-auto rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-image-hover"
              />

              <div className="flex flex-col gap-4 mt-12 transition-all duration-300 ease-in-out">
                <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                  {product.nombre}
                </h1>
                <h2 className="text-lg text-gray-600">
                  {product.descripcion}
                </h2>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-5">
                  <span className="text-3xl font-bold text-gray-900">
                    ${Number(product.precio).toFixed(2)}
                  </span>
                  <div
                    className="inline-block bg-green-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold text-center shadow-stock-glow transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-700 hover:shadow-stock-glow-hover"
                  >
                    {product.stock} en stock
                  </div>
                </div>

                <button
                  className="px-6 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 ease-in-out shadow-[0_4px_12px_rgba(0,0,0,0.15)] font-poppins 
                            bg-[#3B001E] text-white hover:bg-[#92400e] 
                            disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Agregando..." : "Agregar al carrito"}
                </button>

                {showConfirmModal && (
                  <ConfirmModal
                    title="Agregar producto al carrito"
                    message={`¿Estás segura de que deseas agregar "${product.nombre}" al carrito?`}
                    onConfirm={confirmAddToCart}
                    onCancel={cancelAddToCart}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Características */}
        <div className="backdrop-blur-[12px] backdrop-saturate-180 bg-white/70 rounded-2xl p-7 h-fit shadow-glass border border-white/30 lg:min-w-[500px] transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-accent-blue">
            Características del producto
          </h2>

          {/* Características principales */}
          {product.especificaciones?.caracteristicas_principales && (
            <div className="mb-5 transition-all duration-250 ease-in-out">
              <h3 className="text-sm font-semibold text-gray-700 mb-2.5">
                Características principales
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                {Object.entries(product.especificaciones.caracteristicas_principales).map(
                  ([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="p-3 font-semibold text-gray-700 bg-gray-100/80 rounded-l-lg transition-all duration-300 ease-in-out">
                        {key}
                      </div>
                      <div className="p-3 bg-white/80 text-gray-900 text-sm rounded-r-lg shadow-[inset_0_0_4px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
                        {String(value)}
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          )}

          {/* Otras características */}
          {product.especificaciones?.otros && (
            <div className="transition-all duration-250 ease-in-out">
              <h3 className="text-sm font-semibold text-gray-700 mb-2.5">
                Otros
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                {Object.entries(product.especificaciones.otros).map(
                  ([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="p-3 font-semibold text-gray-700 bg-gray-100/80 rounded-l-lg transition-all duration-300 ease-in-out">
                        {key}
                      </div>
                      <div className="p-3 bg-white/80 text-gray-900 text-sm rounded-r-lg shadow-[inset_0_0_4px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out">
                        {String(value)}
                      </div>
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;