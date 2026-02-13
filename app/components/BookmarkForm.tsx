'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Props {
  userId: string
}

export default function BookmarkForm({ userId }: Props) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    setIsSubmitting(true)
    const { error } = await supabase.from('bookmarks').insert({
      title: title.trim(),
      url: url.trim(),
      user_id: userId,
    })

    if (error) {
      alert('Failed to add bookmark: ' + error.message)
    } else {
      setTitle('')
      setUrl('')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-12 bg-white rounded-3xl shadow p-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="md:col-span-2 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
          required
        />
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="md:col-span-2 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-2xl transition"
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  )
}