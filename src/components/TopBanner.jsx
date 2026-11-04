import { useState } from 'react'
import KakaoIcon from './KakaoIcon.jsx'
import './TopBanner.css'

const HIDE_KEY = 'topBannerHiddenDate'

// 오늘 "하루 보지 않기"를 눌렀는지
function isHiddenToday() {
  try {
    return localStorage.getItem(HIDE_KEY) === new Date().toDateString()
  } catch {
    return false
  }
}

function TopBanner() {
  const [isOpen, setIsOpen] = useState(() => !isHiddenToday())

  const hideToday = () => {
    try {
      localStorage.setItem(HIDE_KEY, new Date().toDateString())
    } catch {
      // 저장 실패 시 이번에만 닫기
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="top-banner">
      <a href="#">
        <KakaoIcon size={20} />
        카카오 1초 로그인 <strong>회원가입</strong>
      </a>
      <div className="actions">
        <button type="button" className="today" onClick={hideToday}>
          오늘 하루 보지 않기
        </button>
        <button type="button" className="close" aria-label="닫기" onClick={() => setIsOpen(false)}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default TopBanner
