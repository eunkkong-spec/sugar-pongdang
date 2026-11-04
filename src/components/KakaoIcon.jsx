import { siKakaotalk } from 'simple-icons'

// 카카오톡 정식 심볼 (Simple Icons, CC0). 색은 감싸는 요소의 글자색을 따름
function KakaoIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={siKakaotalk.path} />
    </svg>
  )
}

export default KakaoIcon
