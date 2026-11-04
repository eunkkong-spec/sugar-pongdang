import { useEffect } from 'react'

// 서랍(사이드 메뉴·장바구니)이 열려 있는 동안 ESC로 닫기 + 뒤 화면 스크롤 막기
export function useDrawer(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])
}
