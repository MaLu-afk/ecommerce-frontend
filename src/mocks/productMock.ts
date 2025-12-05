// src/mocks/productMock.ts
import type { ProductDetails } from "../types/productDetail";

// Ejemplo estático

export const MOCK_PRODUCTS: ProductDetails[] = [
  {
    id: 1,
    nombre: "Laptop HP 15-fc0278ia",
    descripcion: "Laptop potente para trabajo y entretenimiento",
    precio: 499.00,
    stock: 50,
    imagen_url: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500"
    ],
    categoria_id: 1,
    recuento_resenas: 212,
    especificaciones: {
      caracteristicas_principales: {
        "Marca": "HP",
        "Modelo": "15-fc0278ia",
        "Procesador": "AMD Ryzen 7-7730U",
        "RAM": "16GB",
        "Almacenamiento": "1TB SSD"
      },
      otros: {
        "Conectividad": "Wi-Fi/BT/HDMI/USB",
        "Tipo de pantalla": "LED 4K",
        "Tamaño de pantalla": "15.6\""
      }
    },
    estado: "activo",
    rating_promedio: 4.6,
    rating_distribucion: {
      5: 150,
      4: 45,
      3: 10,
      2: 5,
      1: 2
    },
    resenas: [
      {
        id: 2,
        usuario_nombre: "Carlos Ruiz",
        rating: 4,
        comentario: "Muy buena relación calidad-precio.",
        fecha: "2025-03-10",
        // verificado: true
      },
      {
        id: 1,
        usuario_nombre: "María González",
        rating: 2.5,
        comentario: "Excelente laptop, muy rápida y el diseño es increíble.",
        fecha: "2025-03-15",
        // verificado: true  
      },
      {
        id: 2,
        usuario_nombre: "Carlos Ruiz",
        rating: 4,
        comentario: "Muy buena relación calidad-precio.",
        fecha: "2025-03-10",
        // verificado: true
      },
      {
        id: 1,
        usuario_nombre: "María González",
        rating: 2.5,
        comentario: "Excelente laptop, muy rápida y el diseño es increíble.",
        fecha: "2025-03-15",
        // verificado: true  
      },
      {
        id: 2,
        usuario_nombre: "Carlos Ruiz",
        rating: 4,
        comentario: "Muy buena relación calidad-precio.",
        fecha: "2025-03-10",
        // verificado: true
      },
      {
        id: 1,
        usuario_nombre: "María González",
        rating: 2.5,
        comentario: "Excelente laptop, muy rápida y el diseño es increíble.",
        fecha: "2025-03-15",
        // verificado: true  
      }
    ]
  },
  {
    id: 2,
    nombre: "Smart TV 55\" 4K UHD",
    descripcion: "Televisor inteligente con tecnología 4K",
    precio: 4999.99,
    stock: 18,
    imagen_url: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"
    ],
    categoria_id: 2,
    recuento_resenas: 89,
    especificaciones: {
      caracteristicas_principales: {
        "Marca": "LG",
        "Modelo": "UQ80",
        "Tamaño": "55 pulgadas"
      },
      otros: {
        "Resolución": "4K UHD",
        "Smart TV": "Sí"
      }
    },
    estado: "activo",
    rating_promedio: 4.3,
    rating_distribucion: {
      5: 50,
      4: 25,
      3: 8,
      2: 4,
      1: 2
    }
  }
];

// Función helper para obtener un producto por ID
export function getMockProduct(id: number): ProductDetails | undefined {
  return MOCK_PRODUCTS.find(p => p.id === id);
}