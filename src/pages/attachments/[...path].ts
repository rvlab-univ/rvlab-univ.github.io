// src/content/attachments/ 의 사진이 아닌 파일(PDF 등)을 /attachments/<경로> 로 그대로 배포한다.
// 사진은 빌드 때 최적화되어 따로 배포되므로 여기서 제외한다.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';

const ROOT = path.resolve('./src/content/attachments');
const SKIP = /\.(jpe?g|png|webp|avif|gif|svg|md)$|(^|\/)\.gitkeep$/i;

export const getStaticPaths = (async () => {
	const files = (await readdir(ROOT, { recursive: true, withFileTypes: true }))
		.filter((f) => f.isFile())
		.map((f) => path.relative(ROOT, path.join(f.parentPath, f.name)))
		.filter((f) => !SKIP.test(f));
	return files.map((f) => ({ params: { path: f.split(path.sep).join('/') } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
	return new Response(await readFile(path.join(ROOT, params.path!)));
};
