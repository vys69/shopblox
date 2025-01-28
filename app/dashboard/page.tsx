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
    },
  });


  return (
    <main className="min-h-screen bg-black p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-300">your stores</h1>
          <Button
            asChild
            className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800"
          >
            <a href="/stores/new">
              <Store className="mr-2 h-5 w-5" />
              create new store
            </a>
          </Button>
        </div>

        {stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center p-8 border border-zinc-900 rounded-lg">
              <h2 className="text-xl text-zinc-300 mb-4">no stores yet</h2>
              <p className="text-zinc-400 mb-6">create your first roblox store to get started</p>
              <Button
                asChild
                className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800"
              >
                <a href="/stores/new">create store</a>
              </Button>
            </div>
            <SignOutButton className="bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800">Not your account?</SignOutButton>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store: any) => (
              <div
                key={store.id}
                className="p-6 border border-zinc-900 rounded-lg"
              >
                <h3 className="text-xl text-zinc-300 mb-2">{store.groupName}</h3>
                <p className="text-zinc-400 mb-4">/{store.slug}</p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <a href={`/stores/${store.slug}`}>view store</a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}