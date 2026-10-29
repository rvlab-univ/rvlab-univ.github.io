// 사이트 전역 설정. 페이지 내용은 src/content/ 의 Markdown 파일에서 수정하세요.

export const SITE_TITLE = 'RV LAB';
export const SITE_DESCRIPTION =
	'경기대학교 전자공학부 RV LAB — 자율주행과 휴머노이드를 연구하는 Robotics and Vision Lab.';

export const LAB = {
	name: 'RV LAB',
	fullName: 'Robotics and Vision Lab.',
	university: '경기대학교 전자공학부',
	email: 'minseongchoi@kyonggi.ac.kr',
	youtube: 'https://www.youtube.com/@RVLAB-UNIV',
};

// 한 페이지에 보여줄 항목 수
export const NEWS_PAGE_SIZE = 6;
export const PUBLICATIONS_PAGE_SIZE = 8;

export const PUBLICATION_CATEGORIES = [
	{ key: 'intl-journal', label: '국제 저널', en: 'International Journals' },
	{ key: 'intl-conference', label: '국제 학회', en: 'International Conferences' },
	{ key: 'domestic-journal', label: '국내 저널', en: 'Domestic Journals' },
	{ key: 'domestic-conference', label: '국내 학회', en: 'Domestic Conferences' },
] as const;
