"use client"

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; // Import the ProductCard component
import { useParams } from "next/navigation";
import { Store, Product } from "@/index"; // Import the types
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/lib/hooks";

const StorePage = () => {
    const { slug } = useParams(); // Use useParams to get the slug from the URL
    const [store, setStore] = useState<Store | null>(null); // Define the type for store
    const [products, setProducts] = useState<Product[]>([]); // Define the type for products
    const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({}); // Store thumbnails by product ID
    const { user, loading } = useUser();

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                console.log("Fetching data for slug:", slug); // Log the slug being fetched
                const response = await fetch(`/api/stores/${slug}`); // Fetch store and products data using the slug
                if (!response.ok) throw new Error("Failed to fetch store data");
                const data = await response.json();
                console.log("API Response:", data); // Log the API response
                setStore(data.store);
                setProducts(data.products || []); // Set products to an empty array if undefined
                console.log("Products set:", data.products); // Log the products being set

                // Fetch thumbnails for all product IDs
                const productIds = data.products.map((product: Product) => product.id);
                const thumbnailResponse = await fetch(`/api/products/thumbnail?id=${productIds.join(',')}`);
                if (!thumbnailResponse.ok) throw new Error("Failed to fetch thumbnails");
                const thumbnailData = await thumbnailResponse.json();
                const thumbnailMap = thumbnailData.data.reduce((acc: { [key: string]: string }, item: any) => {
                    acc[item.id] = item.imageUrl; // Map product ID to thumbnail URL
                    return acc;
                }, {});
                setThumbnails(thumbnailMap); // Set the thumbnails state
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        if (slug) {
            fetchStoreData();
        }
    }, [slug]);

    if (loading && !store) {
        return (
            <div className="p-4 w-screen">
                <Skeleton className="h-8 w-48 mb-4 bg-zinc-900" /> {/* Store name skeleton */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="flex flex-col space-y-3">
                            <Skeleton className="h-[250px] w-full rounded-none bg-zinc-900" /> {/* Product image skeleton */}
                            <Skeleton className="h-4 w-3/4 rounded-none bg-zinc-900" /> {/* Product title skeleton */}
                            <Skeleton className="h-4 w-1/4 rounded-none bg-zinc-900" /> {/* Product price skeleton */}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="p-4 w-screen">
            <h1 className="text-2xl font-bold text-zinc-100 mb-4">{store?.slug}'s store</h1>
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