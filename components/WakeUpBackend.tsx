"use client"
import { useEffect, useState } from "react"

export default function WakeUpBackend() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://invoiceer-o31i.onrender.com/") // 🔁 REPLACE with your backend URL
      .then(() => setLoading(false))
      .catch(() => {
        setTimeout(() => setLoading(false), 5000) // fallback
      })
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Waking up backend server...
        </p>
        <p className="text-sm text-gray-500 mt-1">
          This project is hosted on Render free tier. Please wait this might take few minutes to launch the Backend.
        </p>
      </div>
    </div>
  )
}
