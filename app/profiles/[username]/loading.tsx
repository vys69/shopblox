import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      <div className="flex items-start gap-6">
        <Skeleton className="h-24 w-24 bg-zinc-900" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-4 w-32 bg-zinc-900" />
          <Skeleton className="h-4 w-40 bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
