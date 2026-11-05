import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'
import { useShop } from '../context/useShop.js'
import { getUnitPrice, formatWon } from '../utils/price.js'
import { formatOptions, getOrderSummary, getOrderName } from '../utils/cart.js'
import { welcomeCoupon } from '../data/coupons.js'
import { TOSS_CLIENT_KEY, PENDING_ORDER_KEY } from '../data/payment.js'
import './CheckoutPage.css'

// 결제 후 돌아올 주소 (#/ 방식 주소라 현재 페이지 주소 뒤에 붙임)
const backUrl = (path) => `${window.location.origin}${window.location.pathname}#${path}`
// 주문번호: 결제할 때마다 새로 (토스 규칙: 영문·숫자·-·_ 6~64자)
const makeOrderId = () => `SUGAR-${Date.now()}`

function CheckoutPage() {
  const location = useLocation()
  const { cart, getCoupon, user } = useShop()
  // 바로 구매로 들어오면 그 상품만, 아니면 장바구니 전체
  const buyNow = location.state?.items
  const lines = buyNow || cart
  const source = buyNow ? 'buy' : 'cart'
  const { items, total, delivery, discount, pay } = getOrderSummary(lines, getCoupon(welcomeCoupon.id))

  const [name, setName] = useState(user?.name || '')
  const [nameError, setNameError] = useState('')
  const [payment, setPayment] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [paying, setPaying] = useState(false)

  // 토스 결제창 준비 (결제하기를 누르면 이 결제창이 뜸)
  useEffect(() => {
    const state = { alive: true } // 페이지를 떠났는지 표시
    loadTossPayments(TOSS_CLIENT_KEY)
      .then((toss) => {
        if (state.alive) setPayment(toss.payment({ customerKey: ANONYMOUS }))
      })
      .catch(() => {
        if (state.alive) setLoadError('지금은 결제창을 불러올 수 없어요. 잠시 후 다시 시도해 주세요.')
      })
    return () => {
      state.alive = false
    }
  }, [])

  if (!items.length) {
    return (
      <div className="section checkout-page">
        <div className="empty">
          <p>주문할 상품이 없어요.</p>
          <Link to="/" className="btn-pay">
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    )
  }

  const requestPay = async () => {
    if (!name.trim()) {
      setNameError('주문자 이름을 적어 주세요.')
      document.getElementById('checkout-name')?.focus()
      return
    }
    const orderId = makeOrderId()
    const orderName = getOrderName(items)
    // 결제 후 돌아와서 금액·주문 확인용
    try {
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({ orderId, orderName, amount: pay, source, lines }))
    } catch {
      // 저장 실패해도 결제는 진행
    }
    setPaying(true)
    try {
      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: pay },
        orderId,
        orderName,
        customerName: name.trim(),
        successUrl: backUrl('/payment/success'),
        failUrl: backUrl('/payment/fail'),
      })
    } catch (e) {
      // 구매자가 결제창을 닫은 경우는 조용히 돌아옴
      if (e.code !== 'USER_CANCEL') alert(e.message || '결제를 요청하지 못했어요.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="section checkout-page">
      <h2 className="page-title">주문·결제</h2>
      <p className="test-notice">🧪 토스페이먼츠 테스트 결제예요. 실제로 돈이 빠져나가지 않아요.</p>

      <section className="box">
        <h3>주문 상품 ({items.length})</h3>
        <ul className="items">
          {items.map((item) => (
            <li key={item.key || item.id}>
              <img src={item.product.image} alt="" />
              <div>
                <p className="name">{item.product.title}</p>
                {formatOptions(item) && <p className="options">{formatOptions(item)}</p>}
                <p className="price">
                  {formatWon(getUnitPrice(item.product, item.size) * item.qty)} <span>· {item.qty}개</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="box">
        <h3>주문자</h3>
        <label htmlFor="checkout-name">이름</label>
        <input
          id="checkout-name"
          type="text"
          autoComplete="name"
          value={name}
          aria-invalid={Boolean(nameError)}
          onChange={(e) => {
            setName(e.target.value)
            setNameError('')
          }}
        />
        {nameError && <p className="error">{nameError}</p>}
      </section>

      <section className="box">
        <h3>결제 금액</h3>
        <dl className="summary">
          <dt>상품 금액</dt>
          <dd>{formatWon(total)}</dd>
          <dt>배송비</dt>
          <dd>{delivery === 0 ? '무료' : formatWon(delivery)}</dd>
          {discount > 0 && (
            <>
              <dt>쿠폰 할인</dt>
              <dd className="discount">−{formatWon(discount)}</dd>
            </>
          )}
          <dt className="total">최종 결제 금액</dt>
          <dd className="total price">{formatWon(pay)}</dd>
        </dl>
      </section>

      {loadError && <p className="error">{loadError}</p>}
      <button type="button" className="btn-pay" disabled={!payment || paying} onClick={requestPay}>
        {payment ? `${formatWon(pay)} 결제하기` : '결제창 불러오는 중…'}
      </button>
    </div>
  )
}

export default CheckoutPage
