// RAWG 이미지는 원본이 커서(1~2MB) 작게 줄인 주소로 바꿔 써요.
// 예: https://media.rawg.io/media/screenshots/... → https://media.rawg.io/media/resize/640/-/screenshots/...
export const rawgImage = (url) => url.replace('media.rawg.io/media/', 'media.rawg.io/media/resize/640/-/')

// 표지 파일이 없으면 RAWG 배경 이미지로 바꾸고, 그것도 없으면 빈칸으로 둬요.
export const coverFallback = (game) => (e) => {
  const img = e.currentTarget
  if (game.backgroundImage && !img.dataset.fallback) {
    img.dataset.fallback = '1'
    img.src = rawgImage(game.backgroundImage)
  } else {
    img.style.visibility = 'hidden'
  }
}
