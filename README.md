# RV LAB 홈페이지 (Astro)

Astro 공식 `blog` 템플릿을 기반으로 만든 연구실 소개 사이트입니다.

## 구조

| 경로 | 내용 | 수정할 파일 |
| --- | --- | --- |
| `/` | 소개, 연구 분야, 최근 소식·논문, 모집 배너 | `src/consts.ts` |
| `/research` | 연구 분야 | `src/consts.ts` (`RESEARCH_AREAS`) |
| `/members` | 구성원 (역할별) | `src/data/members.json` |
| `/publications`, `/publications/2` … | 논문 목록 (페이지네이션) | `src/data/publications.json` |
| `/news`, `/news/2` … | 소식 목록 (페이지네이션) | `src/content/news/*.md` |
| `/news/<slug>` | 소식 상세 (이전/다음 글) | |

- 페이지당 개수: `src/consts.ts`의 `NEWS_PAGE_SIZE`, `PUBLICATIONS_PAGE_SIZE`
- 페이지네이터: `src/components/Pagination.astro` (Astro `paginate()`의 `page`를 받아 이전/번호/다음, 페이지가 많으면 `…` 생략)
- 논문 저자 앞에 `*`를 붙이면 연구실 구성원으로 굵게 표시됩니다.

## 실행 (Node 22 필요 → Docker)

```sh
docker run --rm -it -p 4321:4321 -v "$PWD":/w -w /w node:22-bookworm-slim npx astro dev --host 0.0.0.0
docker run --rm -v "$PWD":/w -w /w node:22-bookworm-slim npx astro build   # → dist/
```

## 배포 (GitHub Pages)

GitHub Pages는 `deploy` 브랜치의 루트를 그대로 서빙합니다. `main`에서 빌드한 `dist/`를 `deploy` 브랜치에 커밋합니다.
(`public/.nojekyll`이 있어야 `_astro/` 폴더가 Jekyll에 무시되지 않습니다.)

```sh
docker run --rm -v "$PWD":/w -w /w node:22-bookworm-slim npx astro build
git worktree add ../rvlab-deploy deploy
rsync -a --delete --exclude .git dist/ ../rvlab-deploy/
git -C ../rvlab-deploy add -A && git -C ../rvlab-deploy commit -m "Deploy $(git rev-parse --short HEAD)" && git -C ../rvlab-deploy push origin deploy
git worktree remove ../rvlab-deploy
```
