import { useEffect, useState } from 'react'
import { useShop } from '../context/useShop.js'
import CategoryTabs from './CategoryTabs.jsx'
import SearchBar from './SearchBar.jsx'
import './Header.css'

function Header({
  onLogoClick,
  onMenuOpen,
  onMyClick,
  onWishOpen,
  onCartOpen,
  onTabSelect,
  isSearchOpen,
  onSearchToggle,
  keyword,
  onKeywordChange,
}) {
  const { cart, wish } = useShop()
  const [isScrolled, setIsScrolled] = useState(false)

  // 조금이라도 내리면 헤더 아래 구분선 표시
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goHome = (e) => {
    e.preventDefault()
    onLogoClick()
  }

  return (
    <header className={isScrolled ? 'header scrolled' : 'header'}>
      <div className="bar">
        <div className="left">
          <button type="button" aria-label="메뉴" onClick={onMenuOpen}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 6h18M3 12h14M3 18h18" />
            </svg>
          </button>
        </div>

        <h1 className="logo">
          <a href="#" onClick={goHome}>
            <img src="images/common/logo.png" alt="슈가퐁당" />
          </a>
        </h1>

        <div className="util">
          <button type="button" aria-label="검색" onClick={onSearchToggle}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5L21 21" />
            </svg>
          </button>
          <button type="button" aria-label="마이페이지" onClick={onMyClick}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button type="button" className="badge-btn" aria-label={`찜한 상품 ${wish.length}개`} onClick={onWishOpen}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 20s-7-4.4-9-9.2C1.7 7.4 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.5 3.4 4.2 6.8C19 15.6 12 20 12 20z" />
            </svg>
            {wish.length > 0 && <span className="count">{wish.length}</span>}
          </button>
          <button type="button" className="badge-btn" aria-label={`장바구니 ${cart.length}개`} onClick={onCartOpen}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.6" />
              <circle cx="9" cy="19" r="1.4" />
              <circle cx="17" cy="19" r="1.4" />
            </svg>
            {cart.length > 0 && <span className="count">{cart.length}</span>}
          </button>
        </div>
      </div>

      <CategoryTabs onSelect={onTabSelect} />

      {isSearchOpen && <SearchBar keyword={keyword} onKeywordChange={onKeywordChange} onClose={onSearchToggle} />}
    </header>
  )
}

export default Header
