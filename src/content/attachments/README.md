# attachments — 사진·첨부 이미지 폴더

여기에 넣은 사진은 빌드할 때 자동으로 크기가 줄고 webp로 변환되니, 원본 그대로 넣어도 됩니다
(다만 한 장에 10MB 이하로, 너무 큰 원본은 저장소가 무거워집니다).

## 로고

`logo.png` (정사각형)가 헤더 로고, 브라우저 탭 아이콘, 링크 공유 미리보기 이미지로 쓰입니다.
같은 이름으로 파일을 바꾸면 전부 바뀝니다. 현재는 GitHub 조직 rvlab-univ의 프로필 이미지입니다.

## 구성원 사진

`members/이름.jpg` 로 저장하면 구성원 페이지에 자동으로 나옵니다. 이름은 `members.md`에 적힌 그대로
(예: `members/최민성.jpg`, `members/김도윤.png`). 사진이 없으면 이름 첫 글자로 표시됩니다.
3:4 증명사진 비율로 표시됩니다 (다른 비율이면 위쪽을 기준으로 잘립니다).

## 본문 사진

일반 Markdown 이미지 문법으로, **문서 위치 기준 상대 경로**로 씁니다.

- `src/content/projects.md`, `research.md`, `members.md`, `home.md` 에서: `![설명](attachments/사진.jpg)`
- `src/content/news/*.md` 에서: `![설명](../attachments/news/사진.jpg)`

소식 글에서는 본문의 첫 번째 사진이 소식 목록 카드의 썸네일로도 쓰입니다.
폴더는 자유롭게 나눠도 됩니다 (예: `news/`, `projects/`, `research/`).

## PDF 등 첨부 파일

사진이 아닌 파일(PDF 등)도 여기에 넣고 일반 링크로 겁니다. 빌드하면 `/attachments/<경로>`로 그대로 배포됩니다.

- 최상위 문서에서: `[CV (PDF)](attachments/cv/CV_minseong.pdf)`
- `news/*.md`에서: `[발표자료](../attachments/news/slides.pdf)`

## 협력 기관 로고 / 과제 대표 이미지

- `collaborators/` — `home.md`의 `## 협력 기관` 절에서 사용
- `projects/` — `projects.md`에서 각 과제 메타 줄 바로 다음의 사진이 대표 이미지

