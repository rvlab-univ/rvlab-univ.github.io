// 사람이 읽기 편한 Markdown 문서 한 개를 제목(##, ###)과 목록 구조로 나눠
// Astro 콘텐츠 컬렉션 항목으로 만드는 로더.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Loader } from 'astro/loaders';
import type { Heading, Paragraph, PhrasingContent, Root, RootContent } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import YAML from 'yaml';

export interface Doc {
	file: string;
	src: string;
	root: Root;
	frontmatter: Record<string, unknown>;
}

export interface Entry {
	id: string;
	// 본문 이미지의 상대 경로 기준이 되는 문서 (readDoc의 doc.file)
	file?: string;
	data: Record<string, unknown>;
	// 렌더링할 Markdown 본문 (render()로 출력)
	body?: string;
}

export interface Section {
	title: string;
	heading: Heading;
	nodes: RootContent[];
}

// <!-- 주석 --> 은 작성 안내용이므로 무시한다
const isComment = (node: RootContent) => node.type === 'html' && node.value.trim().startsWith('<!--');

// depth 단계 제목 기준으로 노드를 나눈다. 첫 제목 이전 노드는 intro.
export function splitSections(nodes: RootContent[], depth: number) {
	const intro: RootContent[] = [];
	const sections: Section[] = [];
	for (const node of nodes) {
		if (isComment(node)) continue;
		if (node.type === 'heading' && node.depth === depth) {
			sections.push({ title: toString(node).trim(), heading: node, nodes: [] });
		} else {
			(sections.at(-1)?.nodes ?? intro).push(node);
		}
	}
	return { intro, sections };
}

// 노드들의 원본 Markdown 텍스트
export function sourceOf(doc: Doc, nodes: RootContent[]) {
	return nodes
		.filter((n) => !isComment(n))
		.map((n) => doc.src.slice(n.position!.start.offset, n.position!.end.offset))
		.join('\n\n');
}

export const textOf = (nodes: RootContent[] | PhrasingContent[]) =>
	nodes
		.map((n) => toString(n))
		.join('')
		.trim();

// 문단을 줄 단위로 나눈다 (목록 항목의 여러 줄 입력용)
export function linesOf(p: Paragraph): PhrasingContent[][] {
	const lines: PhrasingContent[][] = [[]];
	for (const child of p.children) {
		if (child.type === 'break') {
			lines.push([]);
		} else if (child.type === 'text' && child.value.includes('\n')) {
			child.value.split('\n').forEach((value, i) => {
				if (i > 0) lines.push([]);
				if (value.trim()) lines.at(-1)!.push({ type: 'text', value });
			});
		} else {
			lines.at(-1)!.push(child);
		}
	}
	return lines.filter((line) => textOf(line));
}

// 문단 전체가 YouTube 주소 하나일 때 영상 ID
export function youtubeId(node: RootContent) {
	if (node.type !== 'paragraph') return undefined;
	const m = textOf([node]).match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})\S*$/);
	return m?.[1];
}

// 항목을 만들지 못할 때 어느 파일의 몇 번째 줄인지 알려준다
export function fail(doc: Doc, node: { position?: { start: { line: number } } }, message: string): never {
	throw new Error(`${doc.file}:${node.position?.start.line ?? '?'} — ${message}`);
}

// [CV](attachments/cv.pdf) 처럼 사진이 아닌 첨부 링크는 /attachments/cv.pdf 로 배포되므로 절대 경로로 바꾼다
// (사진 ![...](...) 은 빌드 때 최적화되도록 상대 경로를 그대로 둔다)
export function fileUrl(url: string) {
	return url.replace(/^(?:\.{1,2}\/)*attachments\//, '/attachments/');
}

function rewriteFileLinks(body: string | undefined) {
	return body?.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (match, bang, text, url) =>
		bang ? match : `[${text}](${fileUrl(url)})`,
	);
}

// YouTube 주소만 있는 줄 → 썸네일 + 재생 버튼 링크. [제목](주소) 형식이면 제목을 캡션으로 붙인다.
// 빈 줄 없이 이어 쓴 영상 줄들은 한 문단이 되어 나란히 배치된다 (global.css 의 .yt).
const YOUTUBE_LINE =
	/^[ \t]*(?:\[([^\]]*)\]\()?<?https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})[^\s)>]*>?\)?[ \t]*$/gm;
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function embedVideos(body: string | undefined) {
	return body?.replace(YOUTUBE_LINE, (_, caption: string | undefined, id: string) => {
		const label = caption ? escapeHtml(caption) : '';
		return (
			`<a class="yt" data-yt="${id}" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">` +
			`<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${label || 'YouTube'} 영상" loading="lazy">` +
			`<span class="yt-play" aria-hidden="true">▶</span>` +
			(label ? `<span class="yt-caption">${label}</span>` : '') +
			`</a>`
		);
	});
}

async function readDoc(file: string): Promise<Doc> {
	let src = await readFile(file, 'utf8');
	let frontmatter = {};
	const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
	if (fm) {
		frontmatter = YAML.parse(fm[1]) ?? {};
		src = src.slice(fm[0].length);
	}
	return { file: path.relative(process.cwd(), file), src, root: fromMarkdown(src), frontmatter };
}

export function markdownLoader(options: {
	name: string;
	// 파일 경로 목록, 또는 폴더 경로 (폴더면 _로 시작하지 않는 *.md 전부)
	files?: string[];
	dir?: string;
	parse: (doc: Doc) => Entry[];
}): Loader {
	const listFiles = async () => {
		if (options.files) return options.files.map((f) => path.resolve(f));
		const dir = path.resolve(options.dir!);
		return (await readdir(dir))
			.filter((f) => f.endsWith('.md') && !f.startsWith('_'))
			.sort()
			.map((f) => path.join(dir, f));
	};
	// 문서와 함께 attachments/ 폴더도 감시해 사진을 추가하면 바로 반영한다
	const watched = () =>
		(options.dir ? [path.resolve(options.dir)] : options.files!.map((f) => path.resolve(f))).concat(
			path.resolve('./src/content/attachments'),
		);

	return {
		name: options.name,
		async load({ store, parseData, renderMarkdown, generateDigest, watcher, logger }) {
			const sync = async () => {
				const entries: Entry[] = [];
				for (const file of await listFiles()) {
					const doc = await readDoc(file);
					entries.push(...options.parse(doc).map((e) => ({ file: doc.file, ...e })));
				}
				store.clear();
				for (const entry of entries) {
					const data = await parseData({ id: entry.id, data: entry.data });
					const body = embedVideos(rewriteFileLinks(entry.body?.trim())) || undefined;
					// 본문의 ![](../attachments/사진.jpg) 같은 상대 경로 이미지는 문서 위치 기준으로 찾아 최적화된다
					const rendered = body
						? await renderMarkdown(body, { fileURL: pathToFileURL(path.resolve(entry.file!)) })
						: undefined;
					store.set({
						id: entry.id,
						data,
						body,
						filePath: entry.file,
						rendered,
						assetImports: rendered?.metadata?.imagePaths,
						digest: generateDigest({ data: entry.data, body: body ?? '' }),
					});
				}
			};
			await sync();

			watcher?.add(watched());
			watcher?.on('all', async (_event, changed) => {
				const file = path.resolve(changed);
				if (!watched().some((w) => file === w || file.startsWith(w + path.sep))) return;
				try {
					await sync();
					logger.info(`${path.relative(process.cwd(), file)} 다시 읽음`);
				} catch (e) {
					logger.error(String(e));
				}
			});
		},
	};
}
