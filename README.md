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
- `public/games.json`: 진피클이 노션에서 뽑은 295개 (2026-11-27에 넣음)
- 표지가 없는 게임: Train Sim World ® 6 (빈칸으로 보여요)

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
| `src/App.css`, `src/index.css` | 화면 꾸미기 |
| `public/games.json` | 게임 데이터 (진피클이 노션에서 뽑은 파일, 필드 15개) |
| `public/covers/<Epic ID>.webp` | 표지 294장 (`../epic-archivist/notion-web/covers`에서 복사) |
| `public/icons/` | 앱 아이콘 (`python scripts/make_icons.py`로 만듦) |
| `vite.config.js` | 배포 경로(`/game-library-app/`)와 PWA 설정 |

## 다음 단계
1. 상세 화면 (한 줄 소개, 특징, 노션 링크)
2. 노션과 바로 연결해서 games.json 자동 갱신
