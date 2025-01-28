import React from "react";

interface Product {
  id: string; // Adjust the type based on your actual product ID type
  name: string;
  description: string;
  thumbnailUrl: string; // Assuming you have a thumbnail URL
}

interface ProductCardProps {
  product: Product; // Define the type for the product prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.thumbnailUrl} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <a href={`/products/${product.id}`}>View Details</a>
    </div>
  );
};

export default ProductCard;
