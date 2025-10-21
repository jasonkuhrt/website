export const curatedRepos = ['polen', 'graffle', 'molt'] as const

export type CuratedRepo = (typeof curatedRepos)[number]
