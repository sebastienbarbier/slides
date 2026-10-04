import type { OpenSlideConfig } from '@open-slide/core';

// SLIDE_BASE is set by the GitHub Pages build so assets resolve under
// /<folder>/. Local `pnpm start` leaves it unset and serves at /.
const base = process.env.SLIDE_BASE;

const openSlideConfig: OpenSlideConfig = {
  port: 5174,
  ...(base ? { base } : {}),
  // Dev always keeps the editor. A production build uses this and becomes
  // the player, so arrow keys advance steps on GitHub Pages.
  build: {
    showSlideUi: false,
  },
};

export default openSlideConfig;
