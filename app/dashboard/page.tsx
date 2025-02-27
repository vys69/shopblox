import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";

export default async function Dashboard() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
      name: {},
    },
  });

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-300">your stores</h1>
        <Button
          asChild
          className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 rounded-none"
        >
          <a href="/stores/new">
            <Store className="mr-2 h-5 w-5" />
            create new store
          </a>
        </Button>
      </div>

      {stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center p-8 border border-zinc-900 rounded-none">
            <h2 className="text-xl text-zinc-300 mb-4">no stores yet</h2>
            <p className="text-zinc-400 mb-6">
              create your first roblox store to get started
            </p>
            <Button
              asChild
              className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 rounded-none"
            >
              <a href="/stores/new">create store</a>
            </Button>
          </div>
          <SignOutButton className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 rounded-none">
            Not your account?
          </SignOutButton>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store: any) => (
            <div
              key={store.id}
              className="p-6 border border-zinc-900 rounded-none"
            >
              <p className="text-zinc-400 mb-4">{store.name}</p>
              <p className="text-zinc-400 mb-4">/{store.slug}</p>
              <p className="text-zinc-400 mb-4">
                {store.createdAt.toLocaleDateString()}
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 rounded-none"
              >
                <a href={`/stores/${store.slug}`}>view store</a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
