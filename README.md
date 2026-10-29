# RV LAB 홈페이지

경기대학교 전자공학부 RV LAB(Robotics and Vision Lab.) 홈페이지입니다.

- 사이트: https://rvlab-univ.github.io
- [Astro](https://astro.build) 정적 사이트 (공식 `blog` 템플릿 기반)
- `main`에 push하면 자동으로 배포됩니다.

> 코딩 에이전트(Claude Code 등)로 작업할 때의 규칙은 [`AGENTS.md`](AGENTS.md)에 있습니다.

## 내용 수정하기

**모든 내용은 `src/content/`의 Markdown 문서로 관리합니다.** 구글 사이트에 글 쓰듯 제목(`##`)과 목록(`-`)으로 쓰면
사이트가 그 구조를 읽어 페이지를 만듭니다. 코드는 고칠 필요가 없습니다.

가장 쉬운 방법은 GitHub 웹에서 바로 고치는 것입니다:
파일을 열고 ✏️(Edit) → 수정 → **Commit changes** 를 누르면 몇 분 뒤 사이트에 반영됩니다.
사진은 폴더에서 **Add file → Upload files**로 올립니다.

| 문서 | 페이지 | 작성 방법 |
| --- | --- | --- |
| `home.md` | 홈 | `# 제목` 아래 소개 문구, `## 협력 기관` = 로고 목록, 그 밖의 `##` = 모집 안내 상자 |
| `research.md` | 연구 | `## 🤖 분야 (English)` = 연구 분야, `###` = 대표 연구, `## Research Statement:` = 하단 카드 |
| `members.md` | 구성원 | `## 지도교수 / 학부연구생 …`, `###` = 교수 또는 팀, 학생은 `- **이름** (영문) — 연구 주제` |
| `publications.md` | 논문 | `## 국제 저널 …` 아래 논문 하나 = 목록 항목 하나 (제목 / 저자 / 학회·연도 세 줄) |
| `projects.md` | 프로젝트 | `## 번호. 과제명`, 다음 줄 `지원 기관 · 기간`, 대표 사진 한 줄, 그 아래 자유롭게 |
| `news/*.md` | 소식 | 소식 하나 = 파일 하나. 맨 위에 `date`, `category`만 적고 `# 제목` + 본문 |

각 문서 맨 위 `<!-- -->` 주석에 자세한 작성 규칙이 있습니다 (사이트에는 보이지 않음).

### 예시

논문 추가 — `publications.md`의 해당 분류 맨 위에 세 줄을 붙여 넣습니다.

```md
- **논문 제목**
  저자1, Minseong Choi†
  _IEEE Robotics and Automation Letters_, 2026 · Under Review · [paper](논문 링크) · [video](https://youtu.be/xxxx)
```

학생 추가 — `members.md`의 팀 목록에 한 줄을 추가하고, 사진은 `attachments/members/이름.jpg`로 올립니다.

```md
- **홍길동** (Gildong Hong) — Imitation Learning, VLA
```

소식 추가 — `news/2026-11-01.md` 파일을 새로 만듭니다 (파일 이름이 주소가 됩니다).

```md
---
date: 2026-11-01
category: 세미나
---

# 소식 제목

첫 문단은 소식 목록의 요약으로도 쓰입니다.

![사진 설명](../attachments/news/사진.jpg)
```

`category`는 `공지`, `수상`, `논문`, `행사`, `세미나` 중 하나입니다.

### 사진 · PDF · 영상

- **사진·PDF**는 `src/content/attachments/`에 넣습니다. 사진은 빌드할 때 자동으로 크기를 줄이고 webp로 바꾸므로 원본을 넣어도 됩니다.
  - 구성원 사진: `attachments/members/<이름>.jpg` — 이름만 맞추면 자동 연결, 3:4 증명사진 비율
  - 본문 사진: `![설명](attachments/projects/a.jpg)` (`news/` 안에서는 `../attachments/...`)
  - PDF: `[CV (PDF)](attachments/cv.pdf)` → `/attachments/cv.pdf`로 배포
  - 로고: `attachments/logo.png` — 헤더 로고, 브라우저 탭 아이콘, 공유 미리보기 이미지
- **YouTube**: 본문에 주소만 한 줄로 쓰면 썸네일이 되고, 클릭하면 그 자리에서 재생됩니다.
  `[제목](https://youtu.be/ID)` 형식이면 제목이 붙고, 빈 줄 없이 이어 쓰면 나란히 배치됩니다.

### 주의

- 굵게 표시의 닫는 `**`가 따옴표 바로 뒤에 오고 그 뒤에 한글이 붙으면 굵게가 안 됩니다.
  `**'제목'**을` 대신 `'**제목**'을`처럼 따옴표를 바깥으로 빼세요.
- 구성원 이름(괄호 안 영문 이름 포함)은 논문 저자 목록에서 자동으로 굵게 표시됩니다.
- 형식이 틀리면 `src/content/publications.md:19 — 세 번째 줄에 연도(예: 2026)가 없습니다`처럼 파일과 줄 번호를 알려줍니다.

## 배포

`main`에 push(또는 GitHub 웹에서 커밋)하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 배포합니다.

1. 타입 체크(`astro check`)와 빌드(`astro build`)
2. 결과물(`dist/`)을 `deploy` 브랜치에 커밋
3. GitHub Pages가 `deploy` 브랜치를 서빙 (Settings → Pages → Deploy from a branch)

진행 상황은 저장소의 **Actions** 탭에서 볼 수 있습니다. 문서 형식이 틀려 실패하면 배포되지 않고 이전 사이트가 그대로 유지되며,
실패한 단계의 로그에 원인이 나옵니다. `deploy` 브랜치는 직접 수정하지 마세요.
다시 배포하려면 Actions 탭 → **Deploy site** → **Run workflow**.

## 내 컴퓨터에서 미리보기

Node 22 이상이 필요합니다. Node가 없거나 버전이 낮으면 Docker로 실행합니다.

```sh
# Node 22가 있을 때
npm install
npm run dev            # http://localhost:4321 (.md 저장 시 바로 반영)
npm run build          # → dist/

# Docker로
docker run --rm -it -p 4321:4321 -v "$PWD":/w -w /w node:22-bookworm-slim npx astro dev --host 0.0.0.0
docker run --rm -v "$PWD":/w -w /w node:22-bookworm-slim sh -c 'npx astro check && npx astro build'
```

## 폴더 구조

```
src/
  content/              ← 내용 (여기만 고치면 됨)
    home.md  research.md  members.md  publications.md  projects.md
    news/               소식 (_index.md = 소식 페이지 제목·소개)
    attachments/        사진 · 로고 · PDF
  consts.ts             사이트 이름, 메일, YouTube 주소, 페이지당 항목 수
  lib/
    markdown-loader.ts  Markdown 문서를 읽어 콘텐츠 컬렉션으로 만드는 로더
    parsers.ts          문서별 해석 규칙 (제목·목록 구조 → 데이터)
  content.config.ts     데이터 형식(스키마)
  pages/  components/  layouts/  styles/   화면 템플릿
.github/workflows/deploy.yml   자동 배포
AGENTS.md                      에이전트 작업 가이드 (CLAUDE.md가 불러옴)
```
