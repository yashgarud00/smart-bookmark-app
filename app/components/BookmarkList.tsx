'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import BookmarkItem from './BookmarkItem'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

interface Props {
  userId: string
}

export default function BookmarkList({ userId }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => [newBookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id
            setBookmarks((prev) => prev.filter((b) => b.id !== deletedId))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setBookmarks(data || [])

    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading your bookmarks...</div>
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-2xl font-semibold">Your Bookmarks</h2>
        <div className="text-sm text-gray-500">{bookmarks.length} saved</div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400">No bookmarks yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add one using the form above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <BookmarkItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  )
}