import { useEffect, useState } from 'react'
import { coverFallback, rawgImage } from './images.js'

const BASE = import.meta.env.BASE_URL

const ESRB_KO = {
  Everyone: '전체 이용가',
  'Everyone 10+': '10세 이상',
  Teen: '13세 이상',
  Mature: '17세 이상',
  'Adults Only': '18세 이상',
}

// 스크린샷 목록을 만들어요.
// 1순위: 앱에 들어 있는 Steam 스크린샷 (shots/s<번호>.webp 한 장에 4게임 x 4장 격자, 오프라인에서도 보임)
// 2순위: Steam 것이 없는 게임만 RAWG 스크린샷 (인터넷 필요)
function screenshotsOf(game, shotsMap) {
  const m = shotsMap?.[game.epicId]
  if (m) {
    return Array.from({ length: m[2] }, (_, col) => ({
      key: `steam-${col}`,
      style: {
        backgroundImage: `url('${BASE}shots/s${m[0]}.webp')`,
        backgroundPosition: `${(col / 3) * 100}% ${(m[1] / 3) * 100}%`,
        backgroundSize: '400% 400%',
      },
    }))
  }
  return (game.screenshots ?? []).map((url, i) => ({
    key: `rawg-${i}`,
    style: { backgroundImage: `url('${rawgImage(url)}')`, backgroundSize: 'cover', backgroundPosition: 'center' },
  }))
}

// 게임 상세 화면. games.json(노션 + 진피클의 RAWG 보강 v2.1)에 있는 정보를 보여 줘요.
function GameDetail({ game, shotsMap, onClose }) {
  const [showOriginal, setShowOriginal] = useState(false)

  // Esc 키로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const shots = screenshotsOf(game, shotsMap)
  const features = game.features ? game.features.split(' · ').filter(Boolean) : []
  const metacritic = game.metacritic ?? game.rawgMetacritic
  const info = [
    ['장르', game.genres.join(' · ')],
    ['평균 플레이타임', game.playtime > 0 ? `약 ${game.playtime}시간` : null],
    ['출시일', game.released],
    ['개발사', game.developers?.length ? game.developers.join(', ') : null],
    ['연령 등급', game.esrbRating ? (ESRB_KO[game.esrbRating] ?? game.esrbRating) : null],
    ['추가일', game.addedDate],
  ].filter(([, v]) => v)

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <article className="detail" role="dialog" aria-label={game.title} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="detail-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <header className="detail-head">
          <img src={`${BASE}covers/${game.epicId}.webp`} alt="" onError={coverFallback(game)} />
          <div>
            <h2>{game.title}</h2>
            {game.englishTitle && <p className="english">{game.englishTitle}</p>}
            <p className="tags">
              <span>{game.status}</span>
              <span>{game.koreanSupport}</span>
              {game.controllerSupport && <span>컨트롤러</span>}
            </p>
          </div>
        </header>

        {shots.length > 0 && (
          <section className="detail-sec">
            <h3>스크린샷 {shots.length}장</h3>
            <div className="shots">
              {shots.map((s, i) => (
                <div key={s.key} className="shot" style={s.style} role="img" aria-label={`스크린샷 ${i + 1}`} />
              ))}
            </div>
          </section>
        )}

        <section className="detail-sec scores">
          <div className="score">
            <span className="label">메타크리틱</span>
            <strong>{metacritic ?? '–'}</strong>
          </div>
          <div className="score">
            <span className="label">이용자 평점</span>
            {game.userRating != null ? (
              <strong>
                ★{game.userRating.toFixed(1)}
                <small> / 5 · {game.rawgRatingsCount.toLocaleString()}명</small>
              </strong>
            ) : (
              <strong>–</strong>
            )}
          </div>
        </section>

        {(game.summary || game.description) && (
          <section className="detail-sec">
            <h3>소개</h3>
            {game.summary && <p>{game.summary}</p>}
            {game.description && (
              <>
                <button type="button" className="link original-toggle" onClick={() => setShowOriginal((v) => !v)}>
                  {showOriginal ? '원문 접기 ▲' : '영어 원문 보기 ▼'}
                </button>
                {showOriginal && <p className="original">{game.description}</p>}
              </>
            )}
          </section>
        )}

        {features.length > 0 && (
          <section className="detail-sec">
            <h3>특징</h3>
            <p className="tags">
              {features.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </p>
          </section>
        )}

        <section className="detail-sec info-list">
          {info.map(([label, value]) => (
            <p key={label}>
              <span className="label">{label}</span> {value}
            </p>
          ))}
        </section>

        {game.notionUrl && (
          <a className="notion-link" href={game.notionUrl} target="_blank" rel="noreferrer">
            노션에서 열기 ↗
          </a>
        )}

        {game.rawgId && (
          <p className="credit">
            Game data &amp; images from{' '}
            <a href="https://rawg.io" target="_blank" rel="noreferrer">
              RAWG (rawg.io)
            </a>
          </p>
        )}
      </article>
    </div>
  )
}

export default GameDetail
