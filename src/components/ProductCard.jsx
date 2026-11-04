import { Link } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import { getSalePrice } from '../utils/price.js'
import './ProductCard.css'

function ProductCard({ product, label, children }) {
  const { isInCart, toggleCart, isWished, toggleWish } = useShop()
  const inCart = isInCart(product.id)
  const liked = isWished(product.id)

  const price = getSalePrice(product)
  const badge = label || product.badges[0]
  const detailPath = `/product/${product.id}`

  // 사진·글자는 상세 페이지 링크, 찜·장바구니 버튼은 링크 밖에 따로 (버튼을 링크 안에 넣을 수 없어서)
  return (
    <div className="product-card">
      <div className="thumb">
        <Link to={detailPath} tabIndex={-1}>
          <img src={product.image} alt={product.title} />
        </Link>
        {badge && <span className="badge">{badge}</span>}
        <button
          type="button"
          className={liked ? 'like on' : 'like'}
          aria-label={liked ? '찜 해제' : '찜하기'}
          onClick={() => toggleWish(product.id)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20s-7-4.4-9-9.2C1.7 7.4 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.5 3.4 4.2 6.8C19 15.6 12 20 12 20z" />
          </svg>
        </button>
        <button
          type="button"
          className={inCart ? 'cart on' : 'cart'}
          aria-label={inCart ? '장바구니에서 빼기' : '장바구니 담기'}
          onClick={() => toggleCart(product.id)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.6" />
            <circle cx="9" cy="19" r="1.4" />
            <circle cx="17" cy="19" r="1.4" />
          </svg>
        </button>
        {children}
      </div>

      <Link to={detailPath} className="info">
        <p className="title">{product.title}</p>
        <p className="original">{product.originalPrice.toLocaleString()}원</p>
        <p className="price">
          <span className="rate">{product.discountRate}%</span>
          {price.toLocaleString()}원
        </p>
      </Link>
    </div>
  )
}

export default ProductCard
