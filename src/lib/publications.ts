import { getCollection } from 'astro:content';

// 연도 내림차순, 같은 연도에서는 심사 중인 논문을 먼저. 나머지는 publications.json 순서 유지.
export async function getSortedPublications() {
	const pubs = await getCollection('publications');
	return pubs
		.map((pub, i) => ({ pub, i }))
		.sort(
			(a, b) =>
				b.pub.data.year - a.pub.data.year ||
				Number(b.pub.data.underReview) - Number(a.pub.data.underReview) ||
				a.i - b.i,
		)
		.map(({ pub }) => pub);
}
