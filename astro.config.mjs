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
			name: 'IBM Plex Sans KR',
			cssVariable: '--font-body',
			weights: [400, 500, 700],
			fallbacks: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
		},
		{
			// 탐지 라벨·점수에만 쓴다
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			weights: [500],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
});
