'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

interface Props {
  bookmark: Bookmark
}

export default function BookmarkItem({ bookmark }: Props) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this bookmark?')) return

    setDeleting(true)
    const { error } = await supabase.from('bookmarks').delete().eq('id', bookmark.id)
    if (error) alert('Failed to delete: ' + error.message)
    setDeleting(false)
  }

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-7 flex items-start justify-between hover:border-gray-200 transition">
      <div className="flex-1 min-w-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xl font-medium text-gray-900 hover:text-blue-600 transition line-clamp-1"
        >
          {bookmark.title}
        </a>
        <p className="text-sm text-gray-500 mt-1.5 break-all line-clamp-1">{bookmark.url}</p>
        <p className="text-xs text-gray-400 mt-3">
          {new Date(bookmark.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="ml-6 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-3 rounded-2xl transition disabled:opacity-40"
      >
        {deleting ? '⋯' : '🗑'}
      </button>
    </div>
  )
}