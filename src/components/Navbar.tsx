"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center">
      {/* Left: Brand */}
      <Link href="/" className="text-xl font-bold text-black">
        Panaah
      </Link>

      {/* Right: Links */}
      <div className="flex gap-4 items-center">
        {status === "loading" ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : session ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm text-gray-700 hover:underline"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:underline"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm text-blue-600 hover:underline"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}
