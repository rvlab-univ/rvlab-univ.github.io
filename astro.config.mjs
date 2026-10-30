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
			// 가변 폰트라 400·500·700 이 같은 파일을 쓴다. 범위 하나로 적어야 @font-face 가 굵기마다 반복되지 않는다
			weights: ['400 700'],
			fallbacks: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
		},
	],
});
