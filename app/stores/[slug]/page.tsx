"use client"

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; // Import the ProductCard component
import { useParams } from "next/navigation";
import { Store, Product } from "@/index"; // Import the types

const StorePage = () => {
    const { slug } = useParams(); // Use useParams to get the slug from the URL
    const [store, setStore] = useState<Store | null>(null); // Define the type for store
    const [products, setProducts] = useState<Product[]>([]); // Define the type for products

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
            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        if (slug) {
            fetchStoreData();
        }
    }, [slug]);

    if (!store) return <div>Loading...</div>;

    return (
        <div>
            <h1>{store.name}</h1>
            <h2>Products</h2>
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