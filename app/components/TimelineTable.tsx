import { Github, Link, Play, X } from 'lucide-react'

type TimelineEvent =
  | {
    type: 'experience'
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
  }
  | {
    type: 'education'
    institution: string
    degree: string
    startDate: string
    endDate: string
    description: string
  }
  | {
    type: 'achievement'
    title: string
    issuer: string
    date: string
    description: string
  }
  | {
    type: 'speaking'
    title: string
    venue: string
    date: string
    links: {
      info?: string
      repo?: string
      recording?: string
      twitter?: string
    }
  }
  | {
    type: 'personal'
    title: string
    date: string
    description?: string
    icon?: string
    url?: string
  }

interface Props {
  items: TimelineEvent[]
}

const getEventType = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'experience':
      return 'Work'
    case 'education':
      return 'Education'
    case 'achievement':
      return 'Honour'
    case 'speaking':
      return 'Talk'
    case 'personal':
      return 'Life'
  }
}

const getDateRange = (item: TimelineEvent): string => {
  if (item.type === 'achievement' || item.type === 'speaking' || item.type === 'personal') {
    return item.date
  }
  const endDate = item.endDate === 'Present' ? 'Now' : item.endDate
  return `${item.startDate} - ${endDate}`
}

const getTitle = (item: TimelineEvent): string => {
  switch (item.type) {
    case 'experience':
      return item.title
    case 'education':
      return item.degree
    case 'achievement':
    case 'speaking':
    case 'personal':
      return item.title
  }
}

const getOrganization = (item: TimelineEvent): string => {
  switch (item.type) {
    case 'experience':
      return item.company
    case 'education':
      return item.institution
    case 'achievement':
      return item.issuer
    case 'speaking':
      return item.venue
    case 'personal':
      return ''
  }
}

export const TimelineTable: React.FC<Props> = ({ items }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200 dark:border-gray-800'>
            <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Date</th>
            <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Type</th>
            <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Title</th>
            <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Organization</th>
            <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Slides</th>
            <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Info</th>
            <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Recording</th>
            <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Post</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const org = getOrganization(item)
            return (
              <tr
                key={index}
                className='border-b border-gray-100 dark:border-gray-900 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors'
              >
                <td className='py-3 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top'>
                  {getDateRange(item)}
                </td>
                <td className='py-3 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top'>
                  {getEventType(item.type)}
                </td>
                <td className='py-3 pr-4 text-gray-900 dark:text-gray-100 align-top'>
                  {getTitle(item)}
                </td>
                <td className='py-3 pr-4 text-gray-600 dark:text-gray-400 align-top'>
                  {org}
                </td>
                <td className='py-3 px-2 text-center align-top'>
                  {item.type === 'speaking' && item.links.repo ? (
                    <a
                      className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                      href={item.links.repo}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Slides'
                    >
                      <Github className='w-4 h-4' />
                    </a>
                  ) : (
                    <span className='text-gray-300 dark:text-gray-700'>-</span>
                  )}
                </td>
                <td className='py-3 px-2 text-center align-top'>
                  {item.type === 'speaking' && item.links.info ? (
                    <a
                      className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                      href={item.links.info}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Event Info'
                    >
                      <Link className='w-4 h-4' />
                    </a>
                  ) : item.type === 'personal' && item.url ? (
                    <a
                      className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                      href={item.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Learn more'
                    >
                      <Link className='w-4 h-4' />
                    </a>
                  ) : (
                    <span className='text-gray-300 dark:text-gray-700'>-</span>
                  )}
                </td>
                <td className='py-3 px-2 text-center align-top'>
                  {item.type === 'speaking' && item.links.recording ? (
                    <a
                      className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                      href={item.links.recording}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Recording'
                    >
                      <Play className='w-4 h-4' />
                    </a>
                  ) : (
                    <span className='text-gray-300 dark:text-gray-700'>-</span>
                  )}
                </td>
                <td className='py-3 px-2 text-center align-top'>
                  {item.type === 'speaking' && item.links.twitter ? (
                    <a
                      className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                      href={item.links.twitter}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Post'
                    >
                      <X className='w-4 h-4' />
                    </a>
                  ) : (
                    <span className='text-gray-300 dark:text-gray-700'>-</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
