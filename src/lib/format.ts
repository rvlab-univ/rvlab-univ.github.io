// 화면 여러 곳에서 쓰는 작은 표시 함수 (서버·브라우저 양쪽에서 쓴다)

// 7 → "07" (과제·연구 번호)
export const pad = (n: number) => String(n).padStart(2, '0');

// 글자마다 늘 같은 0.95~0.99 점수. 얼굴·제목 탐지 박스 라벨의 장식용
export const decorScore = (text: string) => 0.95 + ([...text].reduce((a, c) => a + c.charCodeAt(0), 0) % 5) / 100;
