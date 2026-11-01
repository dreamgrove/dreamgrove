interface YouTubeProps {
  id: string
  title?: string
  start?: number
  autoplay?: boolean
  className?: string
}

const YouTube = ({
  id,
  title = 'YouTube video',
  start = 0,
  autoplay = false,
  className = '',
}: YouTubeProps) => {
  if (!id) {
    return (
      <div className="my-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <p className="font-medium">Error embedding YouTube video: Missing YouTube video ID</p>
      </div>
    )
  }

  const params = new URLSearchParams({ rel: '0' })
  if (start) params.set('start', String(start))
  if (autoplay) params.set('autoplay', '1')
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}` : ''}`

  return (
    <div className={`relative my-4 w-full overflow-hidden rounded-lg ${className}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full border-0"
      />
      <div className="mt-2 text-xs text-gray-500">
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Watch on YouTube
        </a>
      </div>
    </div>
  )
}

export default YouTube
