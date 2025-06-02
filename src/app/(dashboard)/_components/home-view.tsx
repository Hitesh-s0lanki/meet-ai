"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function HomeView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <p>{session.user.name}</p>
      <Button
        variant="default"
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/sign-in"),
            },
          })
        }>
        Sign out
      </Button>
    </div>
  );
}
