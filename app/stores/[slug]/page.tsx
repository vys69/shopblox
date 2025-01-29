"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; // Import the ProductCard component
import { useParams, notFound } from "next/navigation";
import { Store, Product } from "@/index"; // Import the types
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/lib/hooks";
import Link from "next/link";

const StorePage = () => {
  const { slug } = useParams(); // Use useParams to get the slug from the URL
  const [store, setStore] = useState<Store | null>(null); // Define the type for store
  const [products, setProducts] = useState<Product[]>([]); // Define the type for products
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({}); // Store thumbnails by product ID
  const { user, loading } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`/api/stores/${slug}`);
        if (response.status === 404) {
          setError("Store not found");
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch store data");
        
        const data = await response.json();
        setStore(data.store);
        setProducts(data.products || []);

        // Fetch thumbnails for all product IDs
        const productIds = data.products.map((product: Product) => product.id);
        const thumbnailResponse = await fetch(
          `/api/products/thumbnail?id=${productIds.join(",")}`,
        );
        if (!thumbnailResponse.ok)
          throw new Error("Failed to fetch thumbnails");
        const thumbnailData = await thumbnailResponse.json();
        const thumbnailMap = thumbnailData.data.reduce(
          (acc: { [key: string]: string }, item: any) => {
            acc[item.id] = item.imageUrl; // Map product ID to thumbnail URL
            return acc;
          },
          {},
        );
        setThumbnails(thumbnailMap); // Set the thumbnails state
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError("Failed to load store");
      }
    };

    if (slug) {
      fetchStoreData();
    }
  }, [slug]);

  if (error === "Store not found") {
    notFound();
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-black border border-zinc-900 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">{error}</h1>
          <p className="text-zinc-400 mb-4">This store might have been deleted or never existed.</p>
          <Link 
            href="/browse" 
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Browse other stores
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !store) {
    return (
      <div className="p-4 w-screen">
        <Skeleton className="h-8 w-48 mb-4 bg-zinc-900" />{" "}
        {/* Store name skeleton */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-none bg-zinc-900" />{" "}
              {/* Product image skeleton */}
              <Skeleton className="h-4 w-3/4 rounded-none bg-zinc-900" />{" "}
              {/* Product title skeleton */}
              <Skeleton className="h-4 w-1/4 rounded-none bg-zinc-900" />{" "}
              {/* Product price skeleton */}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 w-screen">
      <h1 className="text-2xl font-bold text-zinc-100 mb-4">
        {store?.slug}&apos;s store
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div>No products available.</div> // Handle case with no products
        )}
      </div>
    </div>
  );
};

export default StorePage;
