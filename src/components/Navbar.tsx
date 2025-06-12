'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null // or a small loader if you want

  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between items-center">
      <Link className="font-semibold text-xl" href="/">Panaah</Link>

      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">👋 Hello, {session.user?.name || session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
        >
          Login
        </a>
      )}
    </nav>
  )
}
