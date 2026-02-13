'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import BookmarkForm from './components/BookmarkForm'
import BookmarkList from './components/BookmarkList'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInitialLoading(false)
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      } else if (session) {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">B</div>
            <h1 className="text-2xl font-semibold tracking-tight">Smart Bookmark</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500 hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10 pb-20">
        <BookmarkForm userId={user.id} />
        <BookmarkList userId={user.id} />
      </main>
    </div>
  )
}