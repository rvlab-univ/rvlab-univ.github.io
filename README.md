# RV LAB 홈페이지 (Astro)

Astro 공식 `blog` 템플릿을 기반으로 만든 연구실 소개 사이트입니다.

## 내용 수정 방법

> 코딩 에이전트(Claude Code 등)로 작업할 때의 규칙은 [`AGENTS.md`](AGENTS.md)에 있습니다.

**모든 내용은 `src/content/`의 Markdown 문서에서 수정합니다.** 구글 사이트에 글 쓰듯 제목(`##`)과 목록(`-`)으로 쓰면
사이트가 그 구조를 읽어 페이지를 만듭니다. 각 문서 맨 위 `<!-- -->` 주석에 작성 규칙이 있습니다.

| 문서 | 페이지 | 구조 |
| --- | --- | --- |
| `home.md` | `/` | `# 제목` 아래 소개 문구, `##` 절 = 모집 안내 상자 |
| `research.md` | `/research` | `## 🤖 분야 (English)` = 연구 분야, `###` = 대표 연구, `## Research Statement:` = 하단 카드 |
| `members.md` | `/members` | `## 지도교수 / 학부연구생 …`, `###` = 교수 또는 팀, 학생은 `- **이름** (영문) — 연구 주제` |
| `publications.md` | `/publications` | `## 국제 저널 …` 아래 논문 하나 = 목록 항목 하나 (제목 / 저자 / 학회·연도 세 줄) |
| `projects.md` | `/projects` | `## 번호. 과제명`, 다음 줄 `지원 기관 · 기간`, 그 아래 자유롭게 |
| `news/*.md` | `/news` | 소식 하나 = 파일 하나. 맨 위에 `date`, `category`만 적고 `# 제목` + 본문 |

예: 논문 추가는 `publications.md`의 해당 분류 아래에 세 줄을 붙여 넣으면 됩니다.

```md
- **논문 제목**
  저자1, Minseong Choi†
  _IEEE Robotics and Automation Letters_, 2026 · Under Review · [video](https://youtu.be/xxxx)
```

- 구성원 이름(괄호 안 영문 이름 포함)은 논문 저자 목록에서 자동으로 굵게 표시됩니다.
- 형식이 어긋나면 `src/content/publications.md:19 — 세 번째 줄에 연도(예: 2026)가 없습니다`처럼 파일과 줄 번호를 알려줍니다.
- 문서를 Markdown 구조로 읽는 규칙은 `src/lib/parsers.ts`에 있습니다.
- 사이트 이름·메일·YouTube 주소와 페이지당 항목 수는 `src/consts.ts`에 있습니다.

## 실행 (Node 22 필요 → Docker)

```sh
docker run --rm -it -p 4321:4321 -v "$PWD":/w -w /w node:22-bookworm-slim npx astro dev --host 0.0.0.0
docker run --rm -v "$PWD":/w -w /w node:22-bookworm-slim npx astro build   # → dist/
```

## 배포 (GitHub Pages)

`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드해서 `deploy` 브랜치에 올리고,
GitHub Pages가 `deploy` 브랜치를 서빙합니다. 진행 상황은 GitHub 저장소의 **Actions** 탭에서 볼 수 있습니다.
문서 형식이 틀리면 빌드가 실패하고 이전 사이트가 그대로 유지됩니다.
