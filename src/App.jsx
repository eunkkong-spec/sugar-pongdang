import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import TopBanner from './components/TopBanner.jsx'
import Header from './components/Header.jsx'
import SideMenu from './components/SideMenu.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import WishDrawer from './components/WishDrawer.jsx'
import CouponModal from './components/CouponModal.jsx'
import ContactBox from './components/ContactBox.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import JoinPage from './pages/JoinPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import PaymentResultPage from './pages/PaymentResultPage.jsx'
import { useShop } from './context/useShop.js'
import NotFoundPage from './pages/NotFoundPage.jsx'
import StyleGuide from './pages/StyleGuide.jsx'
import './App.css'

// 화면이 다시 그려진 뒤 해당 영역으로 이동
function scrollToId(id) {
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, 0)
}

// 헤더·메뉴·푸터가 있는 쇼핑몰 공통 틀
function ShopLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishOpen, setIsWishOpen] = useState(false)
  const [isCouponOpen, setIsCouponOpen] = useState(false)
  const { user } = useShop()

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  const closeWish = useCallback(() => setIsWishOpen(false), [])
  const closeCoupon = useCallback(() => setIsCouponOpen(false), [])

  // 페이지가 바뀌면 맨 위로 (메인의 특정 영역 이동 요청이 있으면 그 영역으로)
  useEffect(() => {
    const target = location.state?.scrollTo
    if (target) scrollToId(target)
    else window.scrollTo(0, 0)
  }, [location])

  const closeSearch = () => {
    setIsSearchOpen(false)
    setKeyword('')
  }

  // 아이콘 메뉴·사이드 메뉴: 정해진 페이지, 메인의 영역, 상품 목록 중 하나로 이동
  const selectMenu = (menu) => {
    closeSearch()
    if (menu.path) navigate(menu.path)
    else if (menu.scroll) navigate('/', { state: { scrollTo: menu.scroll } })
    else navigate(`/products?category=${menu.filter}`)
  }

  const toggleSearch = () => {
    if (isSearchOpen) {
      closeSearch()
      return
    }
    // 검색 결과 페이지에서 열면 지금 검색어를 그대로 보여주기
    setKeyword(new URLSearchParams(location.search).get('q') || '')
    setIsSearchOpen(true)
  }

  // 검색어를 입력하면 검색 결과(상품 목록) 페이지로
  const changeKeyword = (value) => {
    setKeyword(value)
    const word = value.trim()
    if (!word) return
    const isSearchPage = location.pathname === '/products' && new URLSearchParams(location.search).has('q')
    navigate(`/products?q=${encodeURIComponent(word)}`, { replace: isSearchPage })
  }

  // 로고: 검색·열린 메뉴를 모두 닫고 메인 맨 위로
  const goHome = () => {
    closeSearch()
    setIsMenuOpen(false)
    setIsCartOpen(false)
    setIsWishOpen(false)
    navigate('/')
  }

  // 탭 메뉴: 정해진 페이지가 있으면 그 페이지로, 아니면 메인의 해당 영역으로
  const selectTab = (tab) => {
    if (tab.target === 'top') {
      goHome()
      return
    }
    closeSearch()
    if (tab.path) navigate(tab.path)
    else navigate('/', { state: { scrollTo: tab.target } })
  }

  return (
    <div className="wrap">
      <TopBanner />
      <Header
        onLogoClick={goHome}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMyClick={() => (user ? setIsMenuOpen(true) : navigate('/login'))}
        onWishOpen={() => setIsWishOpen(true)}
        onCartOpen={() => setIsCartOpen(true)}
        onTabSelect={selectTab}
        isSearchOpen={isSearchOpen}
        onSearchToggle={toggleSearch}
        keyword={keyword}
        onKeywordChange={changeKeyword}
      />
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} onSelect={selectMenu} />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <WishDrawer isOpen={isWishOpen} onClose={closeWish} />
      <CouponModal isOpen={isCouponOpen} onClose={closeCoupon} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage onSelectMenu={selectMenu} onCouponOpen={() => setIsCouponOpen(true)} />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage onCartOpen={() => setIsCartOpen(true)} />} />
          <Route path="/order" element={<OrderPage key={location.search} />} />
          <Route path="/reviews" element={<ReviewsPage key={location.search} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/checkout" element={<CheckoutPage key={location.key} />} />
          <Route path="/payment/success" element={<PaymentResultPage type="success" />} />
          <Route path="/payment/fail" element={<PaymentResultPage type="fail" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <ContactBox />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/styleguide" element={<StyleGuide />} />
      <Route path="*" element={<ShopLayout />} />
    </Routes>
  )
}

export default App
