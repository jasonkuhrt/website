import { Module } from '#~/content/module.js'
import { Meta } from '#~/components/meta.js'

const CraftingPage = async () => {
  const repos = await Module.list()
  const featured = repos.filter((r) => r.featured)
  const others = repos.filter((r) => !r.featured)

  return (
    <>
      <Meta title="Crafting" />

      <main>
        <h1>Crafting</h1>
        <p>
          Open source projects I've created or significantly contributed to.
        </p>

        {featured.length > 0 && (
          <section>
            <h2>Featured</h2>
            <div>
              {featured.map((repo) => (
                <RepoCard key={repo.repo} repo={repo} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2>Projects</h2>
          <div>
            {others.map((repo) => (
              <RepoCard key={repo.repo} repo={repo} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

type Repo = Awaited<ReturnType<typeof Module.list>>[number]

const RepoCard: React.FC<{ repo: Repo }> = ({ repo }) => {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <strong>{repo.name}</strong>
        {repo.primaryLanguage && (
          <span>
            {repo.primaryLanguage.name}
          </span>
        )}
      </div>
      {repo.description && (
        <p>{repo.description}</p>
      )}
      <div>
        ⭐ {repo.stargazerCount} • 🍴 {repo.forkCount}
        {repo.latestRelease && ` • ${repo.latestRelease.tagName}`}
      </div>
    </a>
  )
}

export default CraftingPage

export const getConfig = async () => {
  return { render: 'static' } as const
}
