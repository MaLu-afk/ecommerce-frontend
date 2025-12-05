//src/components/list-reco/productCard.tsx
import { Link } from "react-router-dom";
import "./productCard.css";
import type { Product } from "../../types/product"; // 👈 usar tipado real

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.imagen_url?.[0] ?? ""} alt={product.nombre} />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-specs">{product.descripcion ?? ""}</p>
      </div>

      <div className="product-price">
        ${Number(product.precio).toFixed(2)}
      </div>
    </Link>
  );
};

export default ProductCard;
