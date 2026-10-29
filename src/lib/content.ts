import { getCollection, getEntry } from 'astro:content';

// 페이지 제목·소개 문구 (src/content/<id>.md 의 # 제목과 첫 문단들)
export async function getPage(id: string) {
	const page = await getEntry('pages', id);
	if (!page) throw new Error(`pages/${id} 를 찾을 수 없습니다`);
	return page;
}

// 연도 내림차순, 같은 연도에서는 심사 중인 논문 먼저, 그 다음 문서에 적힌 순서
export async function getSortedPublications() {
	return (await getCollection('publications')).sort(
		(a, b) =>
			b.data.year - a.data.year ||
			Number(b.data.underReview) - Number(a.data.underReview) ||
			a.data.order - b.data.order,
	);
}

// 논문 저자 목록에서 굵게 표시할 이름 (구성원 이름 + 괄호 안 영문 이름)
export async function getLabAuthors() {
	const members = await getCollection('members');
	return members.flatMap((m) => [m.data.name, ...m.data.aliases]);
}

export async function getResearchAreas() {
	return (await getCollection('research', (r) => r.data.kind === 'area')).sort((a, b) => a.data.order - b.data.order);
}

export async function getResearchStatements() {
	return (await getCollection('research', (r) => r.data.kind === 'statement')).sort(
		(a, b) => a.data.order - b.data.order,
	);
}
