import { useShop } from '../context/useShop.js'
import { useDrawer } from '../hooks/useDrawer.js'
import { getUnitPrice, formatWon } from '../utils/price.js'
import { formatOptions } from '../utils/cart.js'
import { welcomeCoupon } from '../data/coupons.js'
import data from '../data/products.json'
import './CartDrawer.css'

const { fee, freeOver } = data.common.cake.delivery

function CartDrawer({ isOpen, onClose }) {
  const { cart, changeQty, removeFromCart, getCoupon } = useShop()
  const coupon = getCoupon(welcomeCoupon.id)
  useDrawer(isOpen, onClose)

  // 장바구니 id로 상품 정보 찾기 (없어진 상품은 제외)
  const items = cart
    .map((item) => ({ ...item, product: data.products.find((p) => p.id === item.id) }))
    .filter((item) => item.product)

  const total = items.reduce((sum, item) => sum + getUnitPrice(item.product, item.size) * item.qty, 0)
  const delivery = total === 0 || total >= freeOver ? 0 : fee
  const remain = freeOver - total
  // 받은 쿠폰은 상품 금액을 넘지 않게 할인 (무료배송 기준은 할인 전 금액)
  const discount = coupon ? Math.min(coupon.amount, total) : 0

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
                <dd className="total price">{formatWon(total + delivery - discount)}</dd>
              </dl>
              <button type="button" className="btn-order" onClick={() => alert('주문 기능은 준비 중입니다.')}>
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
