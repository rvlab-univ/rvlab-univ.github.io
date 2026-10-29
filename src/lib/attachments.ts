import type { ImageMetadata } from 'astro';

// src/content/attachments/ 아래의 모든 이미지 (빌드 때 자동으로 크기 조정·webp 변환)
const images = import.meta.glob<{ default: ImageMetadata }>(
	'/src/content/attachments/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG}',
	{ eager: true },
);

// 문서에 적힌 경로(../attachments/news/a.jpg, attachments/a.jpg 등)를 이미지로 찾는다
export function attachment(src: string | undefined): ImageMetadata | undefined {
	if (!src) return undefined;
	const rest = src.replace(/^(\.{1,2}\/)+/, '').replace(/^(src\/)?(content\/)?attachments\//, '');
	return images[`/src/content/attachments/${rest}`]?.default;
}

// 구성원 사진: attachments/members/<이름>.jpg (png, webp 등도 가능)
export function memberPhoto(name: string): ImageMetadata | undefined {
	const prefix = `/src/content/attachments/members/${name.normalize('NFC')}.`;
	const key = Object.keys(images).find((k) => k.normalize('NFC').startsWith(prefix));
	return key ? images[key].default : undefined;
}
