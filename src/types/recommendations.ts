export interface ProductoRecomendado {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  imagen_url?: string; 
  score: number;
}

export interface RecommendationResponse {
  productos: ProductoRecomendado[];
  total: number;
  algoritmo: string;
  metadatos?: any;
}