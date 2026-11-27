import { useState } from 'react'
import GameCard from './GameCard.jsx'

// "오늘 뭐 하지?"
// 기본: 시작 전 + 공식 한글화 + 컨트롤러 지원 게임 중에서 무작위로 하나.
// 찜한 게임이 있으면 "찜한 게임에서만"이 켜지고, 아직 안 끝낸 찜 게임 중에서 골라요.
// 숨긴 게임은 어느 쪽이든 빠져요.
const isCandidate = (g) => g.status === '시작 전' && g.koreanSupport === '공식 한글화' && g.controllerSupport
const DONE = new Set(['엔딩 완료', '완벽 클리어', '중도 하차'])

function TodayPick({ games, favorites, hidden, onOpen }) {
  const [pick, setPick] = useState(null)
  const [favOnly, setFavOnly] = useState(true)

  const visible = games.filter((g) => !hidden.has(g.id))
  const favPool = visible.filter((g) => favorites.has(g.id) && !DONE.has(g.status))
  const useFav = favOnly && favPool.length > 0
  const candidates = useFav ? favPool : visible.filter(isCandidate)

  const choose = () => {
    if (candidates.length === 0) return
    // 방금 나온 게임이 연달아 나오지 않게 해요.
    const pool = candidates.length > 1 ? candidates.filter((g) => g.id !== pick?.id) : candidates
    setPick(pool[Math.floor(Math.random() * pool.length)])
  }

  return (
    <section className="today">
      <div className="today-head">
        <button type="button" className="primary" onClick={choose} disabled={candidates.length === 0}>
          🎲 오늘 뭐 하지?
        </button>
        <span className="hint">
          {useFav ? `♥ 찜한 게임 ${candidates.length}개 중에서` : `시작 전 · 공식 한글화 · 컨트롤러 ${candidates.length}개 중에서`}
        </span>
        {favPool.length > 0 && (
          <label className="check">
            <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} />
            찜한 게임에서만
          </label>
        )}
      </div>
      {pick && (
        <div className="today-pick">
          <GameCard game={pick} as="div" favorite={favorites.has(pick.id)} onOpen={onOpen} />
          {pick.summary && <p className="summary">{pick.summary}</p>}
        </div>
      )}
    </section>
  )
}

export default TodayPick
