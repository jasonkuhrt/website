import { useEffect, useState } from 'react'

interface Props {
  fetchedAt: string
}

export const RepoRefreshTimer: React.FC<Props> = ({ fetchedAt }) => {
  const [countdown, setCountdown] = useState('calculating...')

  useEffect(() => {
    const updateCountdown = () => {
      const fetchedAtDate = new Date(fetchedAt)
      const nextRefresh = new Date(
        fetchedAtDate.getTime() + 24 * 60 * 60 * 1000,
      ) // 24 hours later
      const now = new Date()
      const diff = nextRefresh.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown('refreshing soon...')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setCountdown(`${hours}h ${minutes}m ${seconds}s`)
    }

    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    // Clean up interval on unmount
    return () => {
      clearInterval(interval)
    }
  }, [fetchedAt])

  return (
    <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2'>
      <span className='opacity-60'>Data refreshes in:</span>
      <span className='font-mono'>{countdown}</span>
    </div>
  )
}
