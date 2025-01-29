import React from "react";
import { Product } from "@/index";
import Image from "next/image";
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card p-4 bg-zinc-900 rounded-none border border-zinc-800">
      <div className="aspect-square w-full bg-zinc-900 rounded-none mb-4">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            No Image
          </div>
        )}
      </div>
      <h3 className="text-zinc-100 font-medium">{product.name}</h3>
      <p className="text-zinc-400 text-sm mt-1">{product.description}</p>
      <p className="text-zinc-300 mt-2">R$ {product.price}</p>
    </div>
  );
};

export default ProductCard;
