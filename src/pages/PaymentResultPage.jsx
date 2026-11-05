import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import { formatWon } from '../utils/price.js'
import { PENDING_ORDER_KEY } from '../data/payment.js'
import './CheckoutPage.css'

function readPending() {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_ORDER_KEY))
  } catch {
    return null
  }
}

// 토스가 붙여 주는 값 (#/ 주소 안쪽 또는 바깥쪽 어디에 붙어도 읽기)
function useTossParams() {
  const [hashParams] = useSearchParams()
  const outer = new URLSearchParams(window.location.search)
  return (key) => hashParams.get(key) ?? outer.get(key)
}

function PaymentResultPage({ type }) {
  const param = useTossParams()
  const { clearCart } = useShop()
  const [pending] = useState(readPending)
  const amount = Number(param('amount'))
  const orderId = param('orderId')
  // 결제창에 넘긴 금액과 돌아온 금액이 같은지 확인
  const amountOk = pending && pending.orderId === orderId && pending.amount === amount

  // 성공하면 장바구니 결제였을 때만 장바구니 비우기 (한 번만)
  const handled = useRef(false)
  useEffect(() => {
    if (handled.current) return
    handled.current = true
    if (type === 'success' && amountOk && pending.source === 'cart') clearCart()
    if (type === 'success') sessionStorage.removeItem(PENDING_ORDER_KEY)
  }, [type, amountOk, pending, clearCart])

  if (type === 'fail') {
    return (
      <div className="section checkout-page">
        <div className="result">
          <p className="emoji">😢</p>
          <h2>결제가 완료되지 않았어요</h2>
          <p>{param('message') || '결제를 취소했거나 문제가 생겼어요.'}</p>
          {param('code') && <p className="code">오류 코드: {param('code')}</p>}
          {/* 바로 구매였으면 같은 상품으로, 아니면 장바구니로 다시 결제 */}
          <Link to="/checkout" state={pending?.source === 'buy' ? { items: pending.lines } : undefined} className="btn-pay">
            다시 결제하기
          </Link>
          <Link to="/" className="btn-line">
            메인으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="section checkout-page">
      <div className="result">
        <p className="emoji">🎂</p>
        <h2>결제가 완료되었어요</h2>
        <p>주문해 주셔서 감사해요! 제작 일정은 카카오톡으로 안내드릴게요.</p>
        <dl className="summary">
          <dt>주문번호</dt>
          <dd>{orderId}</dd>
          <dt>주문 상품</dt>
          <dd>{pending?.orderName || '-'}</dd>
          <dt className="total">결제 금액</dt>
          <dd className="total price">{amount ? formatWon(amount) : '-'}</dd>
        </dl>
        {!amountOk && <p className="error">주문 금액을 확인하지 못했어요. 고객센터로 문의해 주세요.</p>}
        <p className="test-notice">
          🧪 테스트 결제라 실제로 결제되지 않았어요. 실제 판매에서는 이 단계에서 서버가 토스에 결제 승인을 요청해요.
        </p>
        <Link to="/" className="btn-pay">
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  )
}

export default PaymentResultPage
