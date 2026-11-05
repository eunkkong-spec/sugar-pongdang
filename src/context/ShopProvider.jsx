import { useEffect, useState } from 'react'
import { ShopContext } from './shopContext.js'
import { getDefaultOptions, makeCartKey } from '../utils/cart.js'
import data from '../data/products.json'

// 장바구니 한 줄 만들기: { key, id, size, flavor, qty }
function makeLine(id, options, qty) {
  return { key: makeCartKey(id, options), id, size: options.size, flavor: options.flavor, qty }
}

const findProduct = (id) => data.products.find((p) => p.id === id)

// 저장된 값 불러오기 (저장소를 못 쓰는 환경이면 빈 배열)
function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

// 장바구니: 예전 형식 [id], { id, qty }는 기본 옵션 줄로 변환
function loadCart() {
  return load('cart').map((item) => {
    if (item.key) return item
    const id = typeof item === 'number' ? item : item.id
    return makeLine(id, getDefaultOptions(findProduct(id)), item.qty || 1)
  })
}

// 로그인한 회원 { name, provider } (데모 로그인, 없으면 null)
function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장 실패 시 화면 상태만 유지
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const [wish, setWish] = useState(() => load('wish'))
  const [coupons, setCoupons] = useState(() => load('coupons'))
  const [user, setUser] = useState(loadUser)

  useEffect(() => save('cart', cart), [cart])
  useEffect(() => save('wish', wish), [wish])
  useEffect(() => save('coupons', coupons), [coupons])
  useEffect(() => save('user', user), [user])

  const login = (info) => setUser(info)
  const logout = () => setUser(null)

  const isWished = (id) => wish.includes(id)

  const toggleWish = (id) => {
    setWish((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // 옵션과 상관없이 이 상품이 한 줄이라도 담겨 있는지
  const isInCart = (id) => cart.some((item) => item.id === id)

  // 상품 카드 🛒: 담겨 있으면 이 상품 줄을 모두 빼고, 없으면 기본 옵션으로 1개 담기
  const toggleCart = (id) => {
    setCart((prev) =>
      prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, makeLine(id, getDefaultOptions(findProduct(id)), 1)],
    )
  }

  // 상세 페이지: 같은 옵션이 있으면 수량만 더하기 (최대 99)
  const addToCart = (id, options, qty) => {
    const key = makeCartKey(id, options)
    setCart((prev) =>
      prev.some((item) => item.key === key)
        ? prev.map((item) => (item.key === key ? { ...item, qty: Math.min(99, item.qty + qty) } : item))
        : [...prev, makeLine(id, options, qty)],
    )
  }

  // 수량은 1~99
  const changeQty = (key, diff) => {
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty: Math.min(99, Math.max(1, item.qty + diff)) } : item)),
    )
  }

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key))
  }

  // 쿠폰은 { id, amount, issuedAt } 형태로 한 번만 발급
  const getCoupon = (id) => coupons.find((coupon) => coupon.id === id)

  const issueCoupon = (id, amount) => {
    setCoupons((prev) => (prev.some((coupon) => coupon.id === id) ? prev : [...prev, { id, amount, issuedAt: Date.now() }]))
  }

  return (
    <ShopContext.Provider
      value={{
        cart,
        isInCart,
        toggleCart,
        addToCart,
        changeQty,
        removeFromCart,
        wish,
        isWished,
        toggleWish,
        coupons,
        getCoupon,
        issueCoupon,
        user,
        login,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
