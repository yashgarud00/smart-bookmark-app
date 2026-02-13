'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/')
    })
  }, [router])

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    if (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">B</div>
        </div>
        <h1 className="text-4xl font-semibold text-center mb-2">Welcome back</h1>
        <p className="text-gray-500 text-center mb-10">Sign in to manage your bookmarks</p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-3 transition disabled:opacity-70"
        >
          {loading ? (
            'Signing in...'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.36-1 2.52-2.13 3.3v2.7h3.44c2.01-1.85 3.17-4.58 3.17-8.26z" />
                <path d="M12 23c3.05 0 5.61-1.01 7.48-2.73l-3.44-2.7c-.95.64-2.17 1.02-4.04 1.02-3.1 0-5.73-2.1-6.67-4.92H2.4v3.07C4.5 20.3 8.05 23 12 23z" />
                <path d="M5.33 14.64c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.98H2.4C1.5 8.8 1 10.85 1 13s.5 4.2 1.4 6.02l3.93-3.07z" />
                <path d="M12 5.38c1.74 0 3.3.6 4.52 1.77l3.38-3.38C17.61 1.64 15.06 1 12 1 8.05 1 4.5 3.7 2.4 6.98l3.93 3.07c.94-2.82 3.57-4.92 6.67-4.92z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-8">
          Only Google authentication is supported
        </p>
      </div>
    </div>
  )
}