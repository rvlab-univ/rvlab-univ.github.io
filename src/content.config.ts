import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { markdownLoader } from './lib/markdown-loader';
import {
	parseHome,
	parseMembers,
	parseNews,
	parsePage,
	parseProjects,
	parsePublications,
	parseResearch,
} from './lib/parsers';

// 내용은 src/content/ 의 Markdown 문서에서 작성합니다. 작성 규칙은 각 문서 맨 위 주석 참고.
const dir = './src/content';
const link = z.object({ label: z.string(), url: z.string() });

// 각 페이지의 제목·소개 문구 (# 제목 + 첫 ## 이전 문단)
const pages = defineCollection({
	loader: markdownLoader({
		name: 'pages',
		files: ['home', 'research', 'members', 'publications', 'projects'].map((f) => `${dir}/${f}.md`).concat(`${dir}/news/_index.md`),
		parse: parsePage,
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

// 홈 아래쪽 절 (home.md 의 ## 절, 쓴 순서대로)
const home = defineCollection({
	loader: markdownLoader({ name: 'home', files: [`${dir}/home.md`], parse: parseHome }),
	schema: z.object({
		title: z.string(),
		order: z.number(),
		kind: z.enum(['text', 'logos']),
	}),
});

const research = defineCollection({
	loader: markdownLoader({ name: 'research', files: [`${dir}/research.md`], parse: parseResearch }),
	schema: z.object({
		kind: z.enum(['area', 'statement']),
		order: z.number(),
		title: z.string(),
		titleEn: z.string().optional(),
		icon: z.string().optional(),
		video: z.string().optional(),
		summary: z.string().optional(),
		keywords: z.array(z.string()).default([]),
		topics: z
			.array(
				z.object({
					title: z.string(),
					summary: z.string(),
					paper: z.string(),
					video: z.string().optional(),
					status: z.string().optional(),
				}),
			)
			.default([]),
	}),
});

const news = defineCollection({
	loader: markdownLoader({ name: 'news', dir: `${dir}/news`, parse: parseNews }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string().optional(),
		pubDate: z.coerce.date(),
		category: z.enum(['공지', '수상', '논문', '행사', '세미나']),
	}),
});

const publications = defineCollection({
	loader: markdownLoader({ name: 'publications', files: [`${dir}/publications.md`], parse: parsePublications }),
	schema: z.object({
		title: z.string(),
		authors: z.string(),
		venue: z.string(),
		year: z.number(),
		category: z.enum(['intl-journal', 'intl-conference', 'domestic-journal', 'domestic-conference']),
		underReview: z.boolean(),
		award: z.string().optional(),
		awardUrl: z.string().optional(),
		links: z.array(link),
		order: z.number(),
	}),
});

const members = defineCollection({
	loader: markdownLoader({ name: 'members', files: [`${dir}/members.md`], parse: parseMembers }),
	schema: z.object({
		name: z.string(),
		nameEn: z.string().optional(),
		role: z.enum(['professor', 'phd', 'ms', 'undergrad', 'alumni']),
		group: z.string(),
		team: z.string().optional(),
		teamDesc: z.string().optional(),
		title: z.string().optional(),
		email: z.string().optional(),
		links: z.array(link).default([]),
		research: z.array(z.string()).default([]),
		aliases: z.array(z.string()).default([]),
		order: z.number(),
	}),
});

const projects = defineCollection({
	loader: markdownLoader({ name: 'projects', files: [`${dir}/projects.md`], parse: parseProjects }),
	schema: z.object({
		no: z.number(),
		title: z.string(),
		funder: z.string(),
		period: z.string(),
		lead: z.boolean(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
	}),
});

export const collections = { pages, home, research, news, publications, members, projects };
