import React from "react";
import { Product } from "@/index";

interface ProductCardProps {
  product: Product; // Define the type for the product prop
}




const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="bg-black w-full h-full"></div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <a href={`/products/${product.id}`}>View Details</a>
    </div>
  );
};

export default ProductCard;
