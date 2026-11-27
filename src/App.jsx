import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Filters from './Filters.jsx'
import GameCard from './GameCard.jsx'
import GameDetail from './GameDetail.jsx'
import TodayPick from './TodayPick.jsx'

// 상세 화면은 주소 끝의 #game=<id>로 열어요. 그래서 휴대폰 뒤로 가기로 닫혀요.
const idFromHash = () => new URLSearchParams(window.location.hash.slice(1)).get('game')

const EMPTY_FILTERS = { query: '', status: '', korean: '', controller: false, genre: '', sort: 'title' }

// 제목(한글·영문) 검색은 대소문자와 띄어쓰기를 무시해요.
const normalize = (text) => (text ?? '').toLowerCase().replace(/\s+/g, '')

// 게임 목록은 public/games.json에서 읽어요 (진피클이 노션에서 뽑은 파일).
function App() {
  const [games, setGames] = useState([])
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [shotsMap, setShotsMap] = useState({})
  const [openId, setOpenId] = useState(idFromHash)
  const openedInApp = useRef(false)

  useEffect(() => {
    const onHash = () => {
      const id = idFromHash()
      if (!id) openedInApp.current = false // 뒤로 가기로 닫힌 경우
      setOpenId(id)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // 스크린샷 목록은 없어도 앱은 동작해요.
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}shots/shots_map.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .then(setShotsMap)
      .catch(() => {})
  }, [])

  const openGame = (game) => {
    openedInApp.current = true
    window.location.hash = `game=${game.id}`
  }
  const closeGame = () => {
    // 앱 안에서 열었으면 뒤로 가기(목록 위치 그대로), 주소로 바로 들어왔으면 #만 지워요.
    if (openedInApp.current) {
      window.history.back()
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setOpenId(null)
    }
  }
  const openGameData = games.find((g) => g.id === openId)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}games.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`games.json을 못 읽었어요 (${res.status})`)
        return res.json()
      })
      .then(setGames)
      .catch((err) => setError(err.message))
  }, [])

  // 필터 선택지는 데이터에 실제로 있는 값으로 만들어요.
  const options = useMemo(() => {
    const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ko'))
    return {
      statuses: unique(games.map((g) => g.status)),
      koreans: unique(games.map((g) => g.koreanSupport)),
      genres: unique(games.flatMap((g) => g.genres)),
    }
  }, [games])

  const shown = useMemo(() => {
    const q = normalize(filters.query)
    const list = games.filter(
      (g) =>
        (!q || normalize(g.title).includes(q) || normalize(g.englishTitle).includes(q)) &&
        (!filters.status || g.status === filters.status) &&
        (!filters.korean || g.koreanSupport === filters.korean) &&
        (!filters.controller || g.controllerSupport) &&
        (!filters.genre || g.genres.includes(filters.genre)),
    )
    if (filters.sort === 'metacritic') {
      // 점수 높은 순, 점수 없는 게임은 맨 뒤로
      return list.sort((a, b) => (b.metacritic ?? -1) - (a.metacritic ?? -1))
    }
    return list.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
  }, [games, filters])

  if (error) return <p className="message">{error}</p>

  return (
    <main>
      <header>
        <h1>내 게임 목록</h1>
        <p className="count">
          {shown.length === games.length ? `${games.length}개` : `${shown.length} / ${games.length}개`}
        </p>
      </header>

      <TodayPick games={games} onOpen={openGame} />

      <Filters
        filters={filters}
        options={options}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {shown.length === 0 && games.length > 0 ? (
        <p className="message">조건에 맞는 게임이 없어요.</p>
      ) : (
        <ul className="game-list">
          {shown.map((game) => (
            <GameCard key={game.id} game={game} onOpen={openGame} />
          ))}
        </ul>
      )}

      {openGameData && <GameDetail game={openGameData} shotsMap={shotsMap} onClose={closeGame} />}
    </main>
  )
}

export default App
