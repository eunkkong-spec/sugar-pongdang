import { Link } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import { useDrawer } from '../hooks/useDrawer.js'
import { getSalePrice, formatWon } from '../utils/price.js'
import { getDefaultOptions } from '../utils/cart.js'
import { products } from '../utils/products.js'
import './CartDrawer.css'
import './WishDrawer.css'

// 찜 서랍: 장바구니 서랍과 같은 모양 (CartDrawer.css 함께 사용)
function WishDrawer({ isOpen, onClose }) {
  const { wish, toggleWish, isInCart, addToCart } = useShop()
  useDrawer(isOpen, onClose)

  // 찜한 순서대로, 없어진 상품은 제외
  const items = wish.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className={isOpen ? 'cart-drawer wish-drawer open' : 'cart-drawer wish-drawer'} inert={!isOpen}>
      <button type="button" className="dim" aria-label="찜 목록 닫기" tabIndex={-1} onClick={onClose} />

      <aside className="panel" aria-label="찜한 상품">
        <div className="top">
          <h2>
            찜한 상품 <em>({items.length})</em>
          </h2>
          <button type="button" className="close" aria-label="찜 목록 닫기" onClick={onClose}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <p>찜한 상품이 없습니다.</p>
            <p className="hint">상품의 ♥를 누르면 여기에 담겨요.</p>
            <button type="button" className="btn-line" onClick={onClose}>
              쇼핑 계속하기
            </button>
          </div>
        ) : (
          <ul className="list">
            {items.map((product) => {
              const inCart = isInCart(product.id)
              return (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`} onClick={onClose}>
                    <img src={product.image} alt="" />
                  </Link>
                  <div className="info">
                    <Link to={`/product/${product.id}`} className="name" onClick={onClose}>
                      {product.title}
                    </Link>
                    <p className="price">{formatWon(getSalePrice(product))}</p>
                    <button
                      type="button"
                      className={inCart ? 'btn-to-cart done' : 'btn-to-cart'}
                      disabled={inCart}
                      onClick={() => addToCart(product.id, getDefaultOptions(product), 1)}
                    >
                      {inCart ? '장바구니에 있어요' : '장바구니 담기'}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove"
                    aria-label={`${product.title} 찜 해제`}
                    onClick={() => toggleWish(product.id)}
                  >
                    ♥
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </aside>
    </div>
  )
}

export default WishDrawer
