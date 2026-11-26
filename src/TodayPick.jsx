import { useState } from 'react'
import GameCard from './GameCard.jsx'

// "오늘 뭐 하지?" — 시작 전 + 공식 한글화 + 컨트롤러 지원 게임 중에서 무작위로 하나 골라요.
const isCandidate = (g) => g.status === '시작 전' && g.koreanSupport === '공식 한글화' && g.controllerSupport

function TodayPick({ games }) {
  const [pick, setPick] = useState(null)
  const candidates = games.filter(isCandidate)

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
        <span className="hint">시작 전 · 공식 한글화 · 컨트롤러 {candidates.length}개 중에서</span>
      </div>
      {pick && (
        <div className="today-pick">
          <GameCard game={pick} as="div" />
          {pick.summary && <p className="summary">{pick.summary}</p>}
        </div>
      )}
    </section>
  )
}

export default TodayPick
