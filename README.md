# 내 게임 목록 앱 (game-library-app)

에픽 게임 라이브러리(노션 DB 295개)를 휴대폰에서 보는 웹앱(PWA)을 만드는 프로젝트예요.
목표는 AI 에이전트들(진인스·진피클·진뮤즈·진클로드)을 활용해서 직접 앱을 만들어 보는 것이에요.
의논은 Slack #ai-에이전트-활용 채널에서 해요.

## 지금 상태 (v1, 2026-11-27)
- Vite + React 프로젝트
- 목록 화면: 표지, 제목, 장르, 메타크리틱, 진행 상태, 한글화, 컨트롤러
- 검색: 한글·영문 제목 (대소문자·띄어쓰기 무시)
- 필터: 진행 상태, 한글화, 장르, 컨트롤러 지원만 / 정렬: 이름순, 메타크리틱 높은 순
- "🎲 오늘 뭐 하지?": 시작 전 + 공식 한글화 + 컨트롤러 지원 게임(127개) 중 무작위 1개
- 상세 화면 (2026-11-27 저녁): 카드를 누르면 아래에서 올라와요. 주소가 `#game=<id>`로 바뀌어서 휴대폰 뒤로 가기·Esc로 닫혀요.
  - 표지 · 영문 제목 · 스크린샷(옆으로 넘기기) · 메타크리틱 · 이용자 평점(RAWG ★/5, 평가 수)
  - 소개(노션 한글 한 줄) + 영어 원문 펼치기 · 특징 · 장르 · 평균 플레이타임 · 출시일 · 개발사 · 연령 등급 · 추가일 · 노션 링크
  - 하단에 RAWG 출처 표기
- 찜·숨기기: 상세 화면의 "♡ 찜하기", "목록에서 숨기기" 버튼. **이 기기(브라우저)에만 저장**돼요(localStorage `game-library:favorites`, `game-library:hidden`). 휴대폰과 PC는 따로예요.
  - 목록: 찜한 게임은 제목 앞에 ♥, 숨긴 게임은 목록에서 빠져요. "보기" 필터로 찜한 게임만/숨긴 게임만 볼 수 있어요.
  - "오늘 뭐 하지?": 찜한 게임이 있으면 "찜한 게임에서만"이 켜져서, 아직 안 끝낸 찜 게임 중에서 골라요(끄면 기존 조건). 숨긴 게임은 항상 빠져요.
- `public/games.json`: **v2.1** — 노션 15개 필드 + 진피클이 RAWG에서 보강한 14개 필드(295개 중 291개 매칭, 평점 250개)
- 스크린샷: Steam 것(앱에 포함, 284게임)을 먼저 쓰고, 없으면 RAWG 스크린샷(인터넷 필요)
- 표지가 없는 Train Sim World ® 6은 RAWG 배경 이미지로 대신 보여요
- RAWG에서도 못 찾은 4개(스크린샷·평점 없음): Steampunks Vs Skeletons, Evergreen Valley, NightReaper2, Typers Combat

## 실행
```
npm install
npm run dev
```
브라우저에서 http://localhost:5173 을 열어요.

## 배포 (GitHub Pages)
- 주소: https://aoidangan.github.io/game-library-app/
- 휴대폰에서 이 주소를 열고 "홈 화면에 추가"를 누르면 앱처럼 쓸 수 있어요. 한 번 열면 인터넷이 없어도 목록이 보여요.
- 고친 내용을 올리려면 `npm run deploy`를 실행해요. 빌드한 `dist`를 `gh-pages` 브랜치에 올려요.
- 코드는 `main` 브랜치에 따로 올려요: `git push`

## 파일
| 파일 | 역할 |
| --- | --- |
| `src/App.jsx` | 데이터 읽기, 검색·필터·정렬 계산, 화면 배치 |
| `src/Filters.jsx` | 검색창, 필터, 정렬 |
| `src/GameCard.jsx` | 게임 카드 하나 |
| `src/TodayPick.jsx` | "오늘 뭐 하지?" 버튼 |
| `src/GameDetail.jsx` | 상세 화면 |
| `src/useStoredSet.js` | 찜·숨기기 목록을 기기에 저장 |
| `src/images.js` | RAWG 이미지 작게 줄이기, 표지 대체 이미지 |
| `public/shots/s<번호>.webp`, `shots_map.json` | Steam 스크린샷 284게임 x 4장 (4게임씩 한 장에 묶음, `../epic-archivist/notion-web`에서 복사) |
| `src/App.css`, `src/index.css` | 화면 꾸미기 |
| `public/games.json` | 게임 데이터 (진피클이 노션에서 뽑은 파일, 필드 15개) |
| `public/covers/<Epic ID>.webp` | 표지 294장 (`../epic-archivist/notion-web/covers`에서 복사) |
| `public/icons/` | 앱 아이콘 (`python scripts/make_icons.py`로 만듦) |
| `vite.config.js` | 배포 경로(`/game-library-app/`)와 PWA 설정 |

## 다음 단계
1. RAWG 영어 설명의 한글 요약 (진피클)
2. 플레이 상태 바꾸기 (처음엔 기기 저장, 나중에 노션과 맞추기)
3. 같이 할 게임 필터, 플레이 시간 반영 "오늘 뭐 하지?" (다음 라운드)
4. 노션과 바로 연결해서 games.json 자동 갱신
