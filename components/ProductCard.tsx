import React, { useEffect, useState } from "react";
import { Product } from "@/index";

interface ProductCardProps {
  product: Product; // Define the type for the product prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      const response = await fetch(`/api/products/thumbnail?id=${product.id}`);
      const data = await response.json();
      if (data.thumbnailUrl) {
        setThumbnailUrl(data.thumbnailUrl);
      }
    };

    fetchThumbnail();
  }, [product.id]);

  return (
    <div className="product-card">
      {thumbnailUrl && <img src={thumbnailUrl} alt={product.name} className="w-full h-auto" />}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <a href={`/products/${product.id}`}>View Details</a>
    </div>
  );
};

export default ProductCard;
