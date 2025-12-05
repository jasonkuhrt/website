// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_Root_getConfig } from './pages/_root';
// prettier-ignore
import type { getConfig as File_BioIndex_getConfig } from './pages/bio/index';
// prettier-ignore
import type { getConfig as File_CraftingIndex_getConfig } from './pages/crafting/index';
// prettier-ignore
import type { getConfig as File_FramingIndex_getConfig } from './pages/framing/index';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_SpeakingIndex_getConfig } from './pages/speaking/index';
// prettier-ignore
import type { getConfig as File_WritingDrivelSlug_getConfig } from './pages/writing/drivel/[slug]';
// prettier-ignore
import type { getConfig as File_WritingEssaysSlug_getConfig } from './pages/writing/essays/[slug]';
// prettier-ignore
import type { getConfig as File_WritingIndex_getConfig } from './pages/writing/index';
// prettier-ignore
import type { getConfig as File_WritingScribblesSlug_getConfig } from './pages/writing/scribbles/[slug]';

// prettier-ignore
type Page =
| ({ path: '/_root' } & GetConfigResponse<typeof File_Root_getConfig>)
| ({ path: '/bio' } & GetConfigResponse<typeof File_BioIndex_getConfig>)
| ({ path: '/crafting' } & GetConfigResponse<typeof File_CraftingIndex_getConfig>)
| ({ path: '/framing' } & GetConfigResponse<typeof File_FramingIndex_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/speaking' } & GetConfigResponse<typeof File_SpeakingIndex_getConfig>)
| ({ path: '/writing/drivel/[slug]' } & GetConfigResponse<typeof File_WritingDrivelSlug_getConfig>)
| ({ path: '/writing/essays/[slug]' } & GetConfigResponse<typeof File_WritingEssaysSlug_getConfig>)
| ({ path: '/writing' } & GetConfigResponse<typeof File_WritingIndex_getConfig>)
| ({ path: '/writing/scribbles/[slug]' } & GetConfigResponse<typeof File_WritingScribblesSlug_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
