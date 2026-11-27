import { coverFallback } from './images.js'

// 게임 하나를 보여 주는 카드. 목록과 "오늘 뭐 하지?"에서 같이 써요.
// onOpen을 주면 카드를 눌러 상세 화면을 열 수 있어요.
function GameCard({ game, as: Tag = 'li', onOpen }) {
  const body = (
    <>
      <img
        src={`${import.meta.env.BASE_URL}covers/${game.epicId}.webp`}
        alt=""
        loading="lazy"
        onError={coverFallback(game)}
      />
      <div className="info">
        <h2>{game.title}</h2>
        <p className="meta">
          {game.genres.join(' · ')}
          {game.metacritic != null && ` · 메타 ${game.metacritic}`}
        </p>
        <p className="tags">
          <span>{game.status}</span>
          <span>{game.koreanSupport}</span>
          {game.controllerSupport && <span>컨트롤러</span>}
        </p>
      </div>
    </>
  )

  return (
    <Tag className="game-card">
      {onOpen ? (
        <button type="button" className="card-button" onClick={() => onOpen(game)}>
          {body}
        </button>
      ) : (
        body
      )}
    </Tag>
  )
}

export default GameCard
