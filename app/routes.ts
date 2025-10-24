import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('bio', 'routes/bio.tsx'),
  route('coding', 'routes/coding.tsx'),
  route('drawing', 'routes/drawing.tsx'),
  route('photographing', 'routes/photographing.tsx'),
  route('speaking', 'routes/speaking.tsx'),
  route('writing', 'routes/writing/index.tsx'),
  route('writing/*', 'routes/writing/slug.tsx'),
] satisfies RouteConfig
