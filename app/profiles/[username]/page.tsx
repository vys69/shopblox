import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface ProfilePageProps {
    params: {
        username: string;
    };
}

async function getProfileData(username: string) {
    const user = await prisma.user.findFirst({
        where: { username },
        include: {
            stores: true,
        },
    });
    
    return user;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const user = await getProfileData(params.username);

    if (!user) {
        notFound();
    }

    return (
        <div className="p-4 w-full mx-auto">
            <div className="space-y-8">
                {/* Header Section with Picture and Name */}
                <div className="flex items-start gap-6">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden">
                        {user.picture ? (
                            <Image
                                src={user.picture}
                                alt={user.username}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-800" />
                        )}
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-zinc-100">
                                {user.nickname || user.username}
                            </h1>
                            {user.isSeller && (
                                <Badge variant="secondary">Seller</Badge>
                            )}
                        </div>
                        <p className="text-zinc-400">@{user.username}</p>
                        <p className="text-sm text-zinc-500 mt-2">
                            User since {format(new Date(user.createdAt), 'MMMM yyyy')}
                        </p>
                        
                    </div>
                </div>

                {/* Stores Section */}
                {user.isSeller && user.stores.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-zinc-100">Stores</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.stores.map((store) => (
                                <Link 
                                    href={`/stores/${store.slug}`} 
                                    key={store.id}
                                    className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
                                >
                                    <h3 className="font-medium text-zinc-100">{store.name}</h3>
                                    <p className="text-sm text-zinc-400">{store.slug}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Loading state
export function loading() {
    return (
        <div className="p-4 w-full max-w-4xl mx-auto">
            <div className="flex items-start gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
        </div>
    );
} 