// src/content/*.md 문서별 해석 규칙. 작성 방법은 각 문서 맨 위의 <!-- --> 주석에 있습니다.
import type { Image, Link, Paragraph } from 'mdast';
import { PUBLICATION_CATEGORIES } from '../consts';
import {
	type Doc,
	type Entry,
	fail,
	fileUrl,
	linesOf,
	sourceOf,
	splitSections,
	textOf,
	youtubeId,
} from './markdown-loader';

// # 제목 아래 전체
function titled(doc: Doc) {
	const { sections } = splitSections(doc.root.children, 1);
	if (!sections[0]) fail(doc, doc.root, '# 제목이 없습니다');
	return sections[0];
}

// 첫 번째 글 문단 (사진만 있는 문단은 건너뛴다)
const firstParagraph = (nodes: Doc['root']['children']) => {
	const p = nodes.find(
		(n): n is Paragraph => n.type === 'paragraph' && n.children.some((c) => c.type !== 'image' && textOf([c])),
	);
	return p ? textOf(p.children.filter((c) => c.type !== 'image')) : '';
};

// 사진만 있는 문단이면 그 사진
function imageOnly(node: Doc['root']['children'][number]): Image | undefined {
	if (node.type !== 'paragraph') return undefined;
	const content = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
	return content.length === 1 && content[0].type === 'image' ? content[0] : undefined;
}

// 본문에 처음 나오는 이미지 경로 (소식 카드 썸네일)
function firstImage(nodes: Doc['root']['children']): string | undefined {
	for (const node of nodes) {
		if (node.type === 'image') return node.url;
		if ('children' in node) {
			const found = firstImage(node.children as Doc['root']['children']);
			if (found) return found;
		}
	}
	return undefined;
}

// 페이지 제목과 소개 문구: # 제목, 그 아래 첫 ## 전까지가 소개
export function parsePage(doc: Doc): Entry[] {
	const page = titled(doc);
	const { intro } = splitSections(page.nodes, 2);
	const id = doc.file.includes('news') ? 'news' : doc.file.replace(/^.*\/|\.md$/g, '');
	const data: Record<string, unknown> = { title: page.title, description: firstParagraph(intro) };

	return [{ id, data, body: sourceOf(doc, intro) }];
}

// 홈 아래쪽 절: home.md 의 ## 절을 쓴 순서대로 전부 보여준다.
// 제목 글자가 아니라 내용 모양으로 종류를 정한다 — 사진만 있는 절은 로고 목록, 그 밖은 글 상자.
export function parseHome(doc: Doc): Entry[] {
	return splitSections(titled(doc).nodes, 2).sections.map((s, order) => {
		if (!s.nodes.length) fail(doc, s.heading, `"## ${s.title}" 절에 내용이 없습니다`);
		const logos = s.nodes.every(
			(n) => n.type === 'paragraph' && n.children.every((c) => c.type === 'image' || (c.type === 'text' && !c.value.trim())),
		);
		return {
			id: `section-${order + 1}`,
			data: { title: s.title, order, kind: logos ? 'logos' : 'text' },
			body: sourceOf(doc, s.nodes),
		};
	});
}

// 연구 분야: ## 🤖 이름 (English) / ### 대표 연구 / ## Research Statement: 제목
export function parseResearch(doc: Doc): Entry[] {
	const { sections } = splitSections(titled(doc).nodes, 2);
	return sections.map((s, order): Entry => {
		const statement = s.title.match(/^Research Statement\s*:?\s*(.*)$/i);
		if (statement) {
			return {
				id: `statement-${order}`,
				data: { kind: 'statement', title: statement[1] || s.title, order },
				body: sourceOf(doc, s.nodes),
			};
		}

		const m = s.title.match(/^(\p{Extended_Pictographic}️?)?\s*(.*?)\s*(?:\(([^)]+)\))?$/u)!;
		const [, icon, title, titleEn] = m;
		const { intro, sections: topics } = splitSections(s.nodes, 3);

		let video: string | undefined;
		let keywords: string[] = [];
		const summary = intro.filter((n) => {
			const id = youtubeId(n);
			if (id) return !(video = id);
			const text = n.type === 'paragraph' ? textOf([n]) : '';
			if (/^키워드\s*:/.test(text)) {
				keywords = text
					.replace(/^키워드\s*:/, '')
					.split(/[,·]/)
					.map((k) => k.trim())
					.filter(Boolean);
				return false;
			}
			return true;
		});

		return {
			id: (titleEn ?? title).toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, ''),
			data: {
				kind: 'area',
				order,
				title,
				titleEn: titleEn ?? title,
				icon: icon ?? '🔬',
				video,
				keywords,
				summary: textOf(summary),
				topics: topics.map((t) => {
					const quote = t.nodes.find((n) => n.type === 'blockquote');
					const paper = quote ? textOf([quote]) : '';
					const status = paper.match(/^(.+?)\s*·\s*/);
					return {
						title: t.title,
						video: t.nodes.map(youtubeId).find(Boolean),
						summary: textOf(t.nodes.filter((n) => n.type === 'paragraph' && !youtubeId(n))),
						status: status?.[1],
						paper: status ? paper.slice(status[0].length) : paper,
					};
				}),
			},
			body: sourceOf(doc, summary),
		};
	});
}

const ROLES: Record<string, string> = {
	지도교수: 'professor',
	박사과정: 'phd',
	석사과정: 'ms',
	학부연구생: 'undergrad',
	졸업생: 'alumni',
};

// 구성원: ## 구분 / ### 지도교수 또는 팀 / - **이름** (영문) — 연구 주제
export function parseMembers(doc: Doc): Entry[] {
	const entries: Entry[] = [];
	for (const group of splitSections(titled(doc).nodes, 2).sections) {
		const role = ROLES[group.title];
		if (!role) fail(doc, group.heading, `"${group.title}"은(는) 알 수 없는 구분입니다 (${Object.keys(ROLES).join(', ')})`);
		const { intro, sections } = splitSections(group.nodes, 3);

		if (role === 'professor') {
			for (const person of sections) {
				const [, name, nameEn] = person.title.match(/^(.*?)\s*(?:\(([^)]+)\))?$/)!;
				const { intro: info, sections: cv } = splitSections(person.nodes, 4);
				const data: Record<string, unknown> = { name, nameEn, role, group: group.title, links: [], research: [] };
				for (const p of info.filter((n): n is Paragraph => n.type === 'paragraph')) {
					const text = textOf([p]);
					if (/^연구 분야\s*:/.test(text)) {
						data.research = text.replace(/^연구 분야\s*:/, '').split('/').map((r) => r.trim());
						continue;
					}
					for (const line of linesOf(p)) {
						const links = line.filter((n) => n.type === 'link');
						if (!links.length) data.title ??= textOf(line);
						for (const link of links) {
							if (link.url.startsWith('mailto:')) data.email = link.url.slice(7);
							else (data.links as object[]).push({ label: textOf([link]), url: fileUrl(link.url) });
						}
					}
				}
				data.aliases = nameEn ? [nameEn.replace(/^Dr\.\s*/, '')] : [];
				const cvNodes = person.nodes.slice(person.nodes.findIndex((n) => n.type === 'heading' && n.depth === 4));
				entries.push({ id: `${role}-${entries.length}`, data: { ...data, order: entries.length }, body: cv.length ? sourceOf(doc, cvNodes) : undefined });
			}
			continue;
		}

		const teams = [{ title: undefined as string | undefined, desc: undefined as string | undefined, nodes: intro }, ...sections.map((t) => ({
			title: t.title,
			desc: firstParagraph(t.nodes) || undefined,
			nodes: t.nodes,
		}))];
		for (const team of teams) {
			for (const list of team.nodes.filter((n) => n.type === 'list')) {
				for (const item of list.children) {
					const p = item.children.find((n): n is Paragraph => n.type === 'paragraph');
					const strong = p?.children.find((n) => n.type === 'strong');
					if (!p || !strong) fail(doc, item, '학생 줄은 - **이름** — 연구 주제 형식이어야 합니다');
					const name = textOf([strong]);
					const rest = textOf([p]).slice(textOf([p]).indexOf(name) + name.length);
					const [, aliases, research] = rest.match(/^\s*(?:\(([^)]*)\))?\s*[—–-]?\s*(.*)$/s)!;
					entries.push({
						id: `${role}-${entries.length}`,
						data: {
							name,
							role,
							group: group.title,
							team: team.title,
							teamDesc: team.desc,
							aliases: aliases ? aliases.split(',').map((a) => a.trim()) : [],
							research: research ? research.split(',').map((r) => r.trim()) : [],
							order: entries.length,
						},
					});
				}
			}
		}
	}
	return entries;
}

// 논문: ## 분류 / - **제목** ↵ 저자 ↵ _학회_, 연도 · Under Review · 🏆 수상 · [링크](주소)
export function parsePublications(doc: Doc): Entry[] {
	const entries: Entry[] = [];
	for (const s of splitSections(titled(doc).nodes, 2).sections) {
		const category = PUBLICATION_CATEGORIES.find((c) => c.label === s.title || c.en === s.title);
		if (!category) {
			fail(doc, s.heading, `"${s.title}"은(는) 알 수 없는 분류입니다 (${PUBLICATION_CATEGORIES.map((c) => c.label).join(', ')})`);
		}
		for (const list of s.nodes.filter((n) => n.type === 'list')) {
			for (const item of list.children) {
				const p = item.children.find((n): n is Paragraph => n.type === 'paragraph');
				const lines = p ? linesOf(p) : [];
				if (lines.length < 3) fail(doc, item, '논문은 제목 / 저자 / 학회·연도 세 줄로 적어주세요');
				const [titleLine, authorLine, venueLine] = lines;
				const venueNode = venueLine.find((n) => n.type === 'emphasis');
				const meta = textOf(venueLine);
				const year = meta.match(/\b(19|20)\d{2}\b/);
				if (!year) fail(doc, item, '세 번째 줄에 연도(예: 2026)가 없습니다');
				const award = meta.match(/🏆\s*([^·]+)/)?.[1].trim();
				const awardLink = award
					? venueLine.find((n): n is Link => n.type === 'link' && textOf([n]) === award)
					: undefined;
				entries.push({
					id: `pub-${entries.length + 1}`,
					data: {
						title: textOf(titleLine),
						authors: textOf(authorLine),
						venue: venueNode ? textOf([venueNode]) : meta.split(',')[0].trim(),
						year: Number(year[0]),
						category: category.key,
						underReview: /Under Review/i.test(meta),
						award,
						// 🏆 수상명 자체에 건 링크는 수상 증빙 링크로 따로 둔다
						awardUrl: awardLink && fileUrl(awardLink.url),
						links: venueLine
							.filter((n): n is Link => n.type === 'link' && n !== awardLink)
							.map((link) => ({ label: textOf([link]), url: fileUrl(link.url) })),
						order: entries.length,
					},
				});
			}
		}
	}
	return entries;
}

// 연구 과제: ## 번호. 제목 / 첫 줄: 지원 기관 · 기간 (· Project Lead) / 나머지는 본문
export function parseProjects(doc: Doc): Entry[] {
	return splitSections(titled(doc).nodes, 2).sections.map((s, i) => {
		const [, no, title] = s.title.match(/^(?:(\d+)\.\s*)?(.*)$/)!;
		const [metaNode, ...rest] = s.nodes;
		const meta = metaNode?.type === 'paragraph' ? textOf([metaNode]).split('·').map((m) => m.trim()) : [];
		if (meta.length < 2) fail(doc, s.heading, '제목 다음 줄에 "지원 기관 · 기간"을 적어주세요');
		// 그 다음 사진만 있는 줄은 대표 이미지
		const cover = rest[0] && imageOnly(rest[0]);
		if (cover) rest.shift();
		return {
			id: `project-${no ?? i + 1}`,
			data: {
				no: Number(no ?? i + 1),
				title,
				funder: meta[0],
				period: meta[1],
				lead: meta.slice(2).some((m) => /project lead/i.test(m)),
				image: cover?.url,
				imageAlt: cover?.alt ?? undefined,
			},
			body: sourceOf(doc, rest),
		};
	});
}

// 소식 글 하나: --- date / category --- # 제목 본문
export function parseNews(doc: Doc): Entry[] {
	const post = titled(doc);
	const { date, category } = doc.frontmatter as { date?: unknown; category?: unknown };
	return [
		{
			id: doc.file.replace(/^.*\/|\.md$/g, ''),
			data: {
				title: post.title,
				description: firstParagraph(post.nodes),
				image: firstImage(post.nodes),
				pubDate: date,
				category,
			},
			body: sourceOf(doc, post.nodes),
		},
	];
}
