import React from "react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Panaah</h1>
        <p className="text-lg text-gray-600 mb-10">
          Find your next affordable stay
        </p>

        <div>
          <input
            type="text"
            placeholder="Search for rooms, cities or localities..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          />
        </div>
      </div>
    </div>
  )
}
