import Link from "next/link";
import Image from "next/image";
interface Base404Props {
  title: string;
  message: string;
  actionText: string;
  actionHref: string;
  image?: string;
}

export default function Base404({ title, message, actionText, actionHref, image }: Base404Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-black border border-zinc-900 rounded-lg p-8 text-center max-w-md w-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">{title}</h1>
        <p className="text-zinc-400 mb-4">{message}</p>
        <Link
          href={actionHref}
          className="rounded-none inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {actionText}
        </Link>
        <div className="mt-4">
          {image && (
            <Image src={image} alt="404" width={200} height={200} />
          )}
        </div>
      </div>
    </div>
  );
} 