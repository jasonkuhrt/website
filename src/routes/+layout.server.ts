// Disable prerendering in CI/CF Pages to avoid OOM errors with large sites
// Routes are rendered on-demand at runtime instead
export const prerender = !(process.env.CF_PAGES || process.env.GITHUB_ACTIONS)
export const trailingSlash = 'always'
