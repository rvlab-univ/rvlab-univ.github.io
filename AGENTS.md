# AGENTS.md — RV LAB 홈페이지 작업 가이드

경기대학교 전자공학부 RV LAB(Robotics and Vision Lab.) 홈페이지입니다. Astro 정적 사이트이고,
https://rvlab-univ.github.io 에 GitHub Pages로 배포됩니다. 이 문서는 Claude Code 같은 코딩 에이전트가
사이트 내용을 고치거나 배포할 때 따를 규칙입니다.

## 가장 중요한 규칙

1. **내용 수정은 `src/content/`의 Markdown 문서만 고친다.** 논문 추가, 구성원 변경, 소식 작성 같은 요청에
   `.astro`, `.ts` 파일을 고칠 필요가 없다. 디자인이나 기능 변경 요청일 때만 코드를 고친다.
2. **문서 형식을 지킨다.** 사이트가 제목(`##`, `###`)과 목록(`-`) 구조를 읽어 페이지를 만든다
   (`src/lib/parsers.ts`). 형식이 어긋나면 빌드가 `파일:줄 — 이유` 형태의 에러를 내며 멈춘다.
   각 문서 맨 위 `<!-- -->` 주석에 그 문서의 작성 규칙이 있으니 먼저 읽는다.
3. **사실을 지어내지 않는다.** 저자, 학회명, 연도, 수상, 링크는 사용자가 준 정보나 확인한 출처에서만 가져온다.
   모르는 값은 비워 두거나 사용자에게 묻는다. 논문의 `[paper]` 링크처럼 주소가 없는 것은 넣지 않는다.
4. **바꾼 뒤에는 반드시 빌드로 확인한다** (아래 "실행과 확인"). 에러가 나면 메시지의 파일과 줄을 고친다.
5. **`main`에 push하면 곧바로 공개 사이트에 배포된다** (아래 "배포"). 그래서 커밋과 push는 사용자가 요청했을 때만 하고,
   push 전에 반드시 빌드 확인을 통과시킨다.
6. **다른 사람도 GitHub 웹에서 직접 커밋한다.** 작업 시작 전에 `git pull --rebase`로 최신 상태를 받고,
   push가 거부되면(non-fast-forward) 원격 커밋을 확인한 뒤 rebase해서 다시 push한다. **force push는 절대 하지 않는다.**

## 문서별 작성 규칙

모든 문서는 `# 제목`으로 시작하고, 첫 `##` 이전 문단이 페이지 상단 소개 문구가 된다.

### `src/content/publications.md` — 논문

`## 분류` 아래에 논문 하나 = 목록 항목 하나, **세 줄**로 쓴다.

```md
## 국제 저널

- **논문 제목**
  저자1, 저자2* and Minseong Choi†
  _학회 또는 저널 이름_, 2026 · Under Review · 🏆 Best Paper Award · [paper](https://…) · [video](https://youtu.be/xxxx)
```

- 분류(`##`)는 `국제 저널`, `국제 학회`, `국내 저널`, `국내 학회` 중 하나다 (`src/consts.ts`의 `PUBLICATION_CATEGORIES`).
- 셋째 줄: `_이름_`(밑줄 기울임)이 학회/저널, 4자리 연도는 필수. `Under Review`, `🏆 수상명`, `[라벨](주소)` 링크는 있을 때만 ` · `로 이어 붙인다.
  링크 순서는 `[paper](논문)` → `[video](YouTube)` → 기타(`[homepage]` 등). 수상 증빙이 있으면 `🏆 [수상명](링크)`처럼 수상명에 건다.
- 저자 표기는 원문 그대로 둔다 (`*` equal contribution, `†` corresponding author).
- 사이트에서는 연도 내림차순, 같은 연도에서는 Under Review 먼저, 그 다음 문서에 적힌 순서로 정렬된다.
  새 논문은 해당 분류의 맨 위에 넣는다.
- 구성원 이름은 저자 목록에서 자동으로 굵게 표시된다. 영문 표기가 다르면 `members.md`에 괄호로 추가한다.

### `src/content/members.md` — 구성원

- `##` = 구분. `지도교수`, `박사과정`, `석사과정`, `학부연구생`, `졸업생`만 쓸 수 있다.
- 지도교수: `### 이름 (영문 이름)`, 그 아래 직함 줄, 연락처 링크 줄(`mailto:`는 이메일로 인식),
  `연구 분야: A / B / C` 줄, 그 다음 `####` 제목들로 CV를 자유롭게 쓴다. 한 항목 안에서 줄을 바꿀 때는 줄 끝에 `\`.
- 학생: `### 팀 이름`과 그 아래 한 줄 팀 설명, 그리고 한 명 = 한 줄.

```md
- **이름** (논문에 쓰는 영문 이름) — 연구 주제, 연구 주제
```

  영문 이름 괄호는 생략 가능하다. 팀 없이 `##` 바로 아래에 목록을 써도 된다.
- 졸업생은 `## 졸업생` 절을 만들어 같은 형식으로 옮긴다 (연구 주제 자리에 진로를 써도 된다).

### `src/content/research.md` — 연구 분야

- `## 아이콘 분야 이름 (English Name)` = 연구 분야 하나. 그 아래:
  - YouTube 주소만 있는 줄 → 대표 영상
  - `키워드: A, B, C` 줄 → 태그
  - 나머지 문단 → 분야 소개
- `### 대표 연구 제목` 아래: YouTube 주소 줄 = 영상, 일반 문단 = 한 줄 요약, `> 인용` 줄 = 논문.
  심사 중이면 인용 앞에 `Under Review · `를 붙인다.
- `## Research Statement: 제목` 절은 페이지 맨 아래 카드로 나오며 본문은 자유 Markdown이다.

### `src/content/projects.md` — 연구 과제

```md
## 10. 과제 이름
지원 기관 · 06.2026 – Present · Project Lead

![대표 사진 설명](attachments/projects/project-10-cover.jpg)

개요 문단과 목록을 자유롭게.

### Related Papers

- 저자. "제목", 학회, 연도. [paper](https://…)
```

`Project Lead`는 해당될 때만 쓴다. 번호가 큰 순서(최신)로 표시된다.
메타 줄 다음에 사진만 있는 줄(`![설명](attachments/projects/a.jpg)`)을 두면 과제 대표 이미지가 되고,
본문 중간의 사진은 그 자리에 그대로 나온다.

### `src/content/news/*.md` — 소식

소식 하나 = 파일 하나. 파일 이름이 주소가 된다 (`2026-11-01.md` → `/news/2026-11-01/`).
같은 날 두 건이면 `2026-11-01-seminar.md`처럼 뒤에 구분어를 붙인다.

```md
---
date: 2026-11-01
category: 세미나
---

# 소식 제목

첫 문단은 목록 카드의 요약으로도 쓰인다.

이후 본문은 자유롭게.
```

`category`는 `공지`, `수상`, `논문`, `행사`, `세미나` 중 하나다. `news/_index.md`는 소식 목록 페이지의 제목과 소개다.

### `src/content/home.md` — 첫 화면

첫 화면은 소개 문구 → 연구 분야 → 연구 하이라이트(영상) → NEWS → 최근 논문 → 협력 기관 → 모집 안내 순이다.
연구 분야와 하이라이트는 `research.md`, NEWS와 최근 논문은 각 문서에서 자동으로 가져온다.
`# 제목` 아래 문단이 소개 문구다. `## 협력 기관` 절의 이미지들은 로고 목록이 되고
(`![기관 이름](attachments/collaborators/파일)` 한 줄에 하나), 그 밖의 `##` 절은 모집 안내 상자가 된다
(`>` 줄은 작은 공지). 절을 지우면 해당 영역이 사라진다.

### `src/content/attachments/` — 사진

- 구성원 사진: `attachments/members/<members.md에 적힌 이름>.jpg` (png, webp 등도 가능). 파일만 넣으면 자동 연결되고,
  없으면 이름 첫 글자 아바타가 나온다. 3:4 증명사진 비율로 표시된다 (다른 비율은 위쪽 기준으로 잘림).
- 본문 사진: 일반 Markdown 이미지 문법, **문서 위치 기준 상대 경로**.
  `projects.md` 등 최상위 문서에서는 `![설명](attachments/projects/a.jpg)`,
  `news/*.md`에서는 `![설명](../attachments/news/a.jpg)`. 소식은 첫 사진이 목록 카드 썸네일과 공유 미리보기 이미지가 된다.
- PDF 같은 사진이 아닌 파일도 `attachments/`에 넣고 일반 링크로 건다: `[CV (PDF)](attachments/cv.pdf)`
  (news에서는 `../attachments/...`). 빌드하면 `/attachments/cv.pdf` 주소로 그대로 배포된다.
- 빌드 때 자동으로 크기 조정·webp 변환되므로 원본을 넣어도 되지만, 한 장 10MB 이하로 둔다.
- 경로가 틀리면 빌드가 이미지를 찾지 못했다는 에러를 낸다. 사진 파일을 지어내거나 외부 URL을 핫링크하지 않는다.

- 로고: `attachments/logo.png` (정사각형). 헤더 로고, 브라우저 탭 아이콘, 링크 공유 기본 이미지로 쓰인다. 같은 이름으로 바꾸면 전부 바뀐다.
  현재 파일은 GitHub 조직 `rvlab-univ`의 프로필 이미지다.

### Markdown 작성 시 주의 (한국어)

굵게 표시의 닫는 `**`가 따옴표·괄호 같은 문장부호 바로 뒤에 오고 그 뒤에 한글이 바로 붙으면 굵게가 적용되지 않고 `**`가 그대로 보인다.

- 잘못: `**'세미나 제목'**를 주제로` → 화면에 `**'세미나 제목'**를` 그대로 표시
- 올바름: `'**세미나 제목**'를 주제로` (따옴표를 굵게 바깥으로)

빌드 후 화면에 `**`가 남은 페이지가 없어야 한다:
`grep -l '\*\*' dist/index.html dist/*/index.html dist/*/*/index.html` 결과가 비어 있으면 정상.

### YouTube 영상 (모든 문서 공통)

- 본문에서 **YouTube 주소만 있는 줄**은 썸네일로 표시되고, 클릭하면 그 자리에서 재생된다(`youtube-nocookie.com` 임베드).
- `[제목](https://youtu.be/ID)`처럼 링크 형식으로 쓰면 영상 아래에 제목이 붙는다.
- 빈 줄 없이 연달아 쓴 영상 줄들은 나란히(그리드) 배치된다.
- 문장 안이나 `- 목록` 안의 YouTube 링크는 일반 링크로 남는다.

### 원문 유지

- `projects.md`의 과제 설명은 구글 사이트의 **영어 원문**을 그대로 옮긴 것이다(명백한 철자 오타만 수정). 번역하지 않는다.

### 스크립트로 문서를 고칠 때 주의

- 각 문서 맨 위 `<!-- -->` 주석 안에도 `## 제목` 같은 예시 문구가 들어 있다. 문자열 검색으로 제목 위치를 찾으면
  주석 안의 예시를 잘못 집을 수 있다 (실제로 `research.md`의 연구 분야가 통째로 잘린 적이 있다).
  위치를 찾을 때는 줄 맨 앞부터 일치하는지 확인하고, 고친 뒤 `grep '^## ' 파일`로 제목 구조가 그대로인지 확인한다.
- 여러 단계로 파일을 지우거나 덮어쓰는 셸 명령은 `&&`로 이어서, 앞 단계가 실패하면 멈추게 한다.

### 그 밖의 설정

- 사이트 이름, 이메일, YouTube 주소, 한 페이지당 항목 수: `src/consts.ts`
- 문서 해석 규칙: `src/lib/parsers.ts`, 로더: `src/lib/markdown-loader.ts`, 데이터 형식(zod 스키마): `src/content.config.ts`
- 문서 형식에 새 정보를 추가해야 하면(예: 구성원 사진), 파서와 스키마와 템플릿을 함께 고치고 이 문서의 규칙도 갱신한다.

## 실행과 확인

Astro 7은 Node 22 이상이 필요하다. 호스트 Node가 낮으면 Docker로 실행한다.

```sh
# 확인 (내용을 바꿨으면 항상 실행): 타입 체크 + 빌드
docker run --rm -v "$PWD":/w -w /w node:22-bookworm-slim sh -c 'npx astro check && npx astro build'

# 미리보기 (http://localhost:4321, .md를 저장하면 바로 반영)
docker run -d --rm --name lab-site-dev -p 4321:4321 -v "$PWD":/w -w /w node:22-bookworm-slim npx astro dev --host 0.0.0.0
docker logs lab-site-dev      # 문서 형식 에러는 여기 나온다
docker rm -f lab-site-dev     # 끄기
```

- `src/content.config.ts`나 `src/lib/*`를 고친 뒤에는 미리보기 서버가 이전 데이터를 계속 보여줄 수 있다. 서버를 재시작한다.
- **빌드할 때는 미리보기 서버를 멈춘다** (`docker stop lab-site-dev`). 둘이 같은 `.astro/` 캐시를 동시에 쓰면
  빌드가 `The collection "…" does not exist or is empty` 경고와 함께 빈 페이지를 만들 수 있다.
- 성공한 빌드는 `[build] 24 page(s) built`처럼 끝난다. 페이지 수는 논문·소식 수에 따라 달라진다.
- 변경을 보고할 때는 무엇이 몇 건 바뀌었는지와 빌드 결과를 함께 알린다.

## 배포

**`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 배포한다.**
타입 체크와 빌드를 거쳐 `dist/`를 `deploy` 브랜치에 커밋하고, GitHub Pages는 `deploy` 브랜치의 루트를 서빙한다
(Settings → Pages → Deploy from a branch). `deploy` 브랜치는 직접 고치지 않는다.

- 문서 형식이 틀리면 Actions의 `astro check`/`astro build` 단계가 `파일:줄 — 이유`와 함께 실패하고 배포되지 않는다.
  `gh run list --workflow deploy.yml`, `gh run view <id> --log-failed`로 확인한다.
- 수동 재배포: GitHub Actions 탭에서 "Deploy site" → Run workflow, 또는 `gh workflow run deploy.yml`.
- 빌드 결과가 이전과 같으면(README나 AGENTS.md만 바꾼 경우 등) `deploy` 브랜치에 커밋하지 않고 "변경 없음"으로 끝난다.
- 워크플로는 기본 토큰 권한이 읽기 전용인 레포에서 `permissions: contents: write`로 `deploy` 브랜치에 push한다.
  Pages 설정(Deploy from a branch → `deploy` / root)은 바꾸지 않는다.
- `public/.nojekyll`을 지우지 않는다. 없으면 GitHub Pages가 `_astro/` 폴더(CSS, 폰트)를 무시해 화면이 깨진다.
- 배포 후 `gh api repos/rvlab-univ/rvlab-univ.github.io/pages/builds/latest`로 Pages 빌드 상태(`built`)를 확인하고,
  https://rvlab-univ.github.io 의 주요 페이지가 200으로 열리는지 확인한다.

## 콘텐츠 출처

초기 내용은 기존 구글 사이트 https://sites.google.com/view/rv-lab 에서 옮겼다. 확인이 필요한 항목:

- 같은 논문의 저자 표기가 "Sangjun Yu"(홈)와 "Sanghun Yoo"(논문 목록)로 다르다. `members.md`에는 Sangjun Yu로 적혀 있다.
- 논문·과제의 `[paper]` 링크와 수상 증빙 링크는 원본의 Google Drive 링크를 옮겼다 (논문 25편).
  UPRuNA(영상만 있음), 국내 저널 2편, ICROS 2026 학회 논문 3편은 원본에도 paper 링크가 없다.
- YouTube 영상은 원본 사이트에 임베드된 것을 모두 옮겼다 (연구 하이라이트, Research Statement, 과제).
- 모집 안내의 "구글 설문지" 링크는 원본에서 주소를 찾지 못해 비어 있다.
- 사진·그림은 구글 사이트에서 내려받아 `attachments/`에 넣었다. 다만 다음 파일은 구글 사이트에서 403(비공개)이라
  받지 못했다: 강민수·이다민·이충헌 사진, 과제 4·5·6·7 등의 일부 본문 그림.
  김도연·강근영·김형래·박철주는 원본도 기본 아바타라 사진이 없다.
  봇 탐지 우회나 브라우저 위장으로 받으려 하지 말고, 사이트 관리자에게 원본 파일을 받아 넣는다.
- 교수 CV PDF는 Google Drive 다운로드 한도(Quota exceeded)로 받지 못해 Drive 링크로 걸려 있다.
  원본 PDF를 `attachments/`에 넣으면 `members.md`의 링크를 `[CV (PDF)](attachments/파일.pdf)`로 바꾼다.
