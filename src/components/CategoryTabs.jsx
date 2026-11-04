import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { tabs } from '../data/tabs.js'
import './CategoryTabs.css'

// 헤더(바+탭)에 가려지는 높이: 이 위치를 지난 영역을 지금 보는 탭으로 표시
const HEADER_OFFSET = 120

function CategoryTabs({ onSelect }) {
  const [active, setActive] = useState('top')
  const listRef = useRef(null)
  // 메인에서는 스크롤 위치로, 다른 페이지에서는 그 페이지 탭(예: 주문제작)에 밑줄
  const { pathname } = useLocation()
  const current = pathname === '/' ? active : tabs.find((tab) => tab.path === pathname)?.target

  // 스크롤 위치에 따라 지금 보고 있는 탭 찾기
  useEffect(() => {
    const handleScroll = () => {
      let current = 'top'
      tabs.forEach((tab) => {
        const el = document.getElementById(tab.target)
        if (el && el.getBoundingClientRect().top <= HEADER_OFFSET) current = tab.target
      })
      setActive(current)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 선택된 탭이 가려져 있으면 탭 줄을 옆으로 밀어서 보이게
  useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector('.active')
    if (!item) return
    list.scrollTo({ left: item.offsetLeft - list.offsetWidth / 2 + item.offsetWidth / 2, behavior: 'smooth' })
  }, [current])

  return (
    <nav className="category-tabs" aria-label="바로가기 메뉴">
      <ul ref={listRef}>
        {tabs.map((tab) => (
          <li key={tab.target} className={current === tab.target ? 'active' : ''}>
            <button type="button" onClick={() => onSelect(tab)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default CategoryTabs
