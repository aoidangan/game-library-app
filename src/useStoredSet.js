import { useCallback, useEffect, useState } from 'react'

// 게임 id 목록을 이 기기(브라우저)에 저장해요. 찜·숨기기에 써요.
// 휴대폰과 PC는 따로 저장돼요. (나중에 노션과 맞추고 싶으면 그때 쓰기를 붙여요)
function load(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? '[]'))
  } catch {
    return new Set()
  }
}

export default function useStoredSet(key) {
  const [set, setSet] = useState(() => load(key))

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...set]))
  }, [key, set])

  const toggle = useCallback((id) => {
    setSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return [set, toggle]
}
