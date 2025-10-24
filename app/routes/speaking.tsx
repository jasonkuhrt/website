import { Github, Link, Play, Twitter } from 'lucide-react'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { talks } from '../consts'
import type { Route } from './+types/speaking'

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Speaking – Kuhrt' },
    { name: 'description', content: 'Talks and presentations by Jason Kuhrt' },
  ]
}

export default function Speaking() {
  return (
    <Section spacing='xl'>
      <Container variant='content'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-800'>
                <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Date</th>
                <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Title</th>
                <th className='text-left py-3 pr-4 text-gray-700 dark:text-gray-300 font-semibold'>Venue</th>
                <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Slides</th>
                <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Info</th>
                <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Recording</th>
                <th className='text-center py-3 px-2 text-gray-700 dark:text-gray-300 font-semibold'>Post</th>
              </tr>
            </thead>
            <tbody>
              {talks.map((talk) => (
                <tr
                  key={`${talk.title}-${talk.date}`}
                  className='border-b border-gray-100 dark:border-gray-900 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors'
                >
                  <td className='py-3 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top'>
                    {talk.date}
                  </td>
                  <td className='py-3 pr-4 text-gray-900 dark:text-gray-100 align-top'>
                    {talk.title}
                  </td>
                  <td className='py-3 pr-4 text-gray-600 dark:text-gray-400 align-top'>
                    {talk.venue}
                  </td>
                  <td className='py-3 px-2 text-center align-top'>
                    {talk.links.repo ? (
                      <a
                        className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                        href={talk.links.repo}
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
                    {talk.links.info ? (
                      <a
                        className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                        href={talk.links.info}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Event Info'
                      >
                        <Link className='w-4 h-4' />
                      </a>
                    ) : (
                      <span className='text-gray-300 dark:text-gray-700'>-</span>
                    )}
                  </td>
                  <td className='py-3 px-2 text-center align-top'>
                    {talk.links.recording ? (
                      <a
                        className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                        href={talk.links.recording}
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
                    {talk.links.twitter ? (
                      <a
                        className='text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors inline-block'
                        href={talk.links.twitter}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Twitter'
                      >
                        <Twitter className='w-4 h-4' />
                      </a>
                    ) : (
                      <span className='text-gray-300 dark:text-gray-700'>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  )
}
