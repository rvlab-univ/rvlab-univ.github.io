import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 연구실 소식: src/content/news/*.md
const news = defineCollection({
	loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			category: z.enum(['공지', '수상', '논문', '행사', '세미나']),
			heroImage: z.optional(image()),
		}),
});

// 논문 목록: src/data/publications.json
const publications = defineCollection({
	loader: file('./src/data/publications.json'),
	schema: z.object({
		title: z.string(),
		// 원문 표기 그대로 (*: equal contribution, †: corresponding author)
		authors: z.string(),
		venue: z.string(),
		year: z.number(),
		category: z.enum(['intl-journal', 'intl-conference', 'domestic-journal', 'domestic-conference']),
		underReview: z.boolean().default(false),
		award: z.string().optional(),
		links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
	}),
});

// 구성원: src/data/members.json
const members = defineCollection({
	loader: file('./src/data/members.json'),
	schema: z.object({
		name: z.string(),
		role: z.enum(['professor', 'phd', 'ms', 'undergrad', 'alumni']),
		team: z.enum(['robot', 'driving']).optional(),
		research: z.array(z.string()),
		order: z.number().default(0),
	}),
});

// 프로젝트: src/data/projects.json
const projects = defineCollection({
	loader: file('./src/data/projects.json'),
	schema: z.object({
		no: z.number(),
		title: z.string(),
		funder: z.string(),
		period: z.string(),
		lead: z.boolean().default(false),
		abstract: z.string(),
		activities: z.array(z.string()),
	}),
});

export const collections = { news, publications, members, projects };
