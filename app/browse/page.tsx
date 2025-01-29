'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Base404 from "@/components/404/Base404";

interface StoreWithDetails {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  description: string;
  groupId: string;
  productCount?: number;
  owner: {
    username: string;
    picture: string;
  };
}

export default function BrowsePage() {
  const [stores, setStores] = useState<StoreWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch('/api/stores/list');
        const data = await response.json();

        if (response.status === 404) {
          setError('not_found');
          setLoading(false);
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch stores');
        
        const storesWithProducts = await Promise.all(
          data.stores.map(async (store: StoreWithDetails) => {
            try {
              const productsResponse = await fetch(`/api/groups/products/fetch?groupId=${store.groupId}`);
              if (productsResponse.ok) {
                const productsData = await productsResponse.json();
                return {
                  ...store,
                  productCount: productsData.data?.length || 0
                };
              }
              return store;
            } catch (error) {
              console.error(`Failed to fetch products for store ${store.name}:`, error);
              return store;
            }
          })
        );

        setStores(storesWithProducts);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError('error');
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="p-4 w-full">
        <h1 className="text-2xl font-bold text-zinc-100 mb-6">Browse Stores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-black border border-zinc-900 rounded-lg p-4 space-y-4">
              <Skeleton className="h-6 w-3/4 bg-zinc-900" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full bg-zinc-900" />
                <Skeleton className="h-4 w-24 bg-zinc-900" />
              </div>
              <Skeleton className="h-4 w-full bg-zinc-900" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <Base404
        title="No Stores Found"
        message="There are no stores available at the moment."
        actionText="Return Home"
        actionHref="/"
      />
    );
  }

  if (error) {
    return (
      <Base404
        title="Error Loading Stores"
        message="There was an error loading the stores. Please try again later."
        actionText="Refresh Page"
        actionHref="/browse"
      />
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Browse Stores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stores.map((store) => (
          <Link 
            href={`/stores/${store.slug}`} 
            key={store.id}
            className="bg-black border border-zinc-900 rounded-lg p-4 hover:border-zinc-800 transition-colors"
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-100">{store.name}</h2>
              
              <div className="flex items-center space-x-2">
                {store.owner.picture ? (
                  <Image
                    src={store.owner.picture}
                    alt={store.owner.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                )}
                <span className="text-sm text-zinc-400">@{store.owner.username}</span>
              </div>

              <div className="text-sm text-zinc-500 space-y-1">
                <p>Created {format(new Date(store.createdAt), 'MMM d, yyyy')}</p>
                <p>{store.productCount || 0} products</p>
              </div>

              {store.description && (
                <p className="text-sm text-zinc-400 line-clamp-2">{store.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 