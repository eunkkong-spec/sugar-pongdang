import { useNavigate } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import { useDrawer } from '../hooks/useDrawer.js'
import { getUnitPrice, formatWon } from '../utils/price.js'
import { formatOptions, getOrderSummary } from '../utils/cart.js'
import { welcomeCoupon } from '../data/coupons.js'
import './CartDrawer.css'

function CartDrawer({ isOpen, onClose }) {
  const { cart, changeQty, removeFromCart, getCoupon } = useShop()
  const navigate = useNavigate()
  useDrawer(isOpen, onClose)

  const { items, total, delivery, discount, pay, remain } = getOrderSummary(cart, getCoupon(welcomeCoupon.id))

  // 주문하기: 서랍을 닫고 결제 페이지로
  const goCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <div className={isOpen ? 'cart-drawer open' : 'cart-drawer'} inert={!isOpen}>
      <button type="button" className="dim" aria-label="장바구니 닫기" tabIndex={-1} onClick={onClose} />

      <aside className="panel" aria-label="장바구니">
        <div className="top">
          <h2>장바구니 <em>({items.length})</em></h2>
          <button type="button" className="close" aria-label="장바구니 닫기" onClick={onClose}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <p>장바구니가 비어 있습니다.</p>
            <button type="button" className="btn-line" onClick={onClose}>
              쇼핑 계속하기
            </button>
          </div>
        ) : (
          <>
            <ul className="list">
              {items.map((item) => (
                <li key={item.key}>
                  <img src={item.product.image} alt="" />
                  <div className="info">
                    <p className="name">{item.product.title}</p>
                    {formatOptions(item) && <p className="options">{formatOptions(item)}</p>}
                    <p className="price">{formatWon(getUnitPrice(item.product, item.size) * item.qty)}</p>
                    <div className="qty">
                      <button type="button" aria-label="수량 빼기" disabled={item.qty <= 1} onClick={() => changeQty(item.key, -1)}>
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button type="button" aria-label="수량 더하기" onClick={() => changeQty(item.key, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove"
                    aria-label={`${item.product.title} 삭제`}
                    onClick={() => removeFromCart(item.key)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="summary">
              {remain > 0 && <p className="notice">{formatWon(remain)} 더 담으면 무료배송!</p>}
              <dl>
                <dt>상품 금액</dt>
                <dd className="price">{formatWon(total)}</dd>
                <dt>배송비</dt>
                <dd className="price">{delivery === 0 ? '무료' : formatWon(delivery)}</dd>
                {discount > 0 && (
                  <>
                    <dt>쿠폰 할인</dt>
                    <dd className="price discount">−{formatWon(discount)}</dd>
                  </>
                )}
                <dt className="total">결제 예정 금액</dt>
                <dd className="total price">{formatWon(pay)}</dd>
              </dl>
              <button type="button" className="btn-order" onClick={goCheckout}>
                주문하기
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
