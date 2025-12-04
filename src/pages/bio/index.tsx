import { Meta } from '#~/components/meta.js'
import {
  DateString,
  Experience,
  ExperienceAchievement,
  ExperienceEducation,
  ExperienceWork,
} from '../../content/experience.js'
import { page, config } from '#~/runtime.js'

export default page(function* () {
  const allExperiences = yield* Experience.list()

  const workItems = allExperiences.filter((e): e is ExperienceWork => e._tag === 'work')
  const educationItems = allExperiences.filter((e): e is ExperienceEducation => e._tag === 'education')
  const achievementItems = allExperiences.filter((e): e is ExperienceAchievement => e._tag === 'achievement')

  return (
    <>
      <Meta title="Bio" />

      <main>
        <h1>Bio</h1>

        <section>
          <h2>Experience</h2>
          {workItems.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.company} · {item.location}</p>
              <p>{item.formatDateRange()}</p>
              {item.overview && <p>{item.overview}</p>}
              {item.technologies && item.technologies.length > 0 && (
                <p>{item.technologies.join(' · ')}</p>
              )}
            </article>
          ))}
        </section>

        <section>
          <h2>Education</h2>
          {educationItems.map((item) => (
            <article key={item.id}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              <p>{item.formatDateRange()}</p>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>

        <section>
          <h2>Achievements</h2>
          {achievementItems.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.issuer}</p>
              <p>{DateString.format(item.date)}</p>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>
      </main>
    </>
  )
})

export const getConfig = config(function* () {
  return { render: 'static' } as const
})
