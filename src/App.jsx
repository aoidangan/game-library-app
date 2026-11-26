import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Filters from './Filters.jsx'
import GameCard from './GameCard.jsx'
import TodayPick from './TodayPick.jsx'

const EMPTY_FILTERS = { query: '', status: '', korean: '', controller: false, genre: '', sort: 'title' }

// 제목(한글·영문) 검색은 대소문자와 띄어쓰기를 무시해요.
const normalize = (text) => (text ?? '').toLowerCase().replace(/\s+/g, '')

// 게임 목록은 public/games.json에서 읽어요 (진피클이 노션에서 뽑은 파일).
function App() {
  const [games, setGames] = useState([])
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(EMPTY_FILTERS)

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

      <TodayPick games={games} />

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
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
