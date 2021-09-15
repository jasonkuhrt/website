import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { socialLinks } from '../data/socialLinks'
import profilePicture from '../public/profile-picture.png'

const Home: NextPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center mt-24">
        <div className="rounded-full overflow-hidden w-48 h-48">
          <Image src={profilePicture} alt="Profile picture of Jason Kuhrt" />
        </div>
        <h1 className="mt-5">Jason Kuhrt</h1>

        <div className="flex mt-3 space-x-5">
          {socialLinks.map((socialLink) => (
            <Link key={socialLink.title} href={socialLink.href}>
              <a title={socialLink.title} className="opacity-20 hover:opacity-100" target="_blank">
                <socialLink.icon size={20} />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
