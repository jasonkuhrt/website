import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('bio', 'routes/bio.tsx'),
  route('crafting', 'routes/crafting.tsx'),
  route('designing', 'routes/designing/index.tsx'),
  route('designing/:slug', 'routes/designing/slug.tsx'),
  route('capturing', 'routes/capturing.tsx'),
  route('speaking', 'routes/speaking.tsx'),
  route('writing', 'routes/writing/index.tsx'),
  route('writing/*', 'routes/writing/slug.tsx'),
] satisfies RouteConfig
