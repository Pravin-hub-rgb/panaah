import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function DashboardPage() {
  const session = await auth(); // ✅ type-safe and cleaner
  
  if (!session?.user) {
    redirect("/signin");
  }

  const user = session?.user;

  return (
    <div className="min-h-screen items-center justify-center bg-gray-100 px-4 flex-col">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">User Dashboard</h1>
        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.image && (
            <Image
              src={user.image}
              alt="User Avatar"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mx-auto mt-4"
            />
          )}
        </div>
      </div>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 mt-4">
        <Link href="/listings/new" className="underline">Post Listing</Link>
      </div>
    </div>
  );
}