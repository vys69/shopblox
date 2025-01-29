'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
    const params = useParams();
    const error = decodeURIComponent(params.error as string);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
            <div className="bg-glack p-8 rounded-none border border-zinc-900 max-w-md w-full">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-zinc-300 mb-6">{error}</p>
                <Link 
                    href="/"
                    className="inline-block bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-none transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
} 