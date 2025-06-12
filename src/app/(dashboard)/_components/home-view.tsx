"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { GenerateAvatar } from "@/components/generate-avatar";

export default function HomeView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p className="p-8 text-center">Loading …</p>;
  }

  const handleSignOut = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/auth/sign-in"),
      },
    });

  return (
    <div className="flex flex-col ">
      {/* — Header */}
      <header className="w-full flex justify-center items-center">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GenerateAvatar
              seed={session.user.name ?? "Unknown"}
              variant="initials"
            />
            <h1 className="text-2xl font-semibold">
              Welcome back, {session.user.name}!
            </h1>
          </div>
          <Button onClick={handleSignOut}>Sign out</Button>
        </div>
      </header>

      {/* — Main content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-medium mb-2">Meetings</h2>
            <p className="text-sm text-gray-600">
              View or join your upcoming meetings.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/meetings")}>
              Go to Meetings
            </Button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-medium mb-2">Agents</h2>
            <p className="text-sm text-gray-600">
              Manage your AI agents and prompts.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/agents")}>
              Go to Agents
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
