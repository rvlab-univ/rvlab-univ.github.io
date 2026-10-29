// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://rvlab-univ.github.io',
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Noto Sans KR',
			cssVariable: '--font-body',
			weights: [400, 500, 700],
			fallbacks: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
		},
	],
});
