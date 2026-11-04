import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductSlider from '../components/ProductSlider.jsx'
import KakaoIcon from '../components/KakaoIcon.jsx'
import { useShop } from '../context/useShop.js'
import { getSalePrice, getUnitPrice, formatWon } from '../utils/price.js'
import { getDefaultOptions } from '../utils/cart.js'
import { products } from '../utils/products.js'
import { orderNotices, checkPoints, kakaoGuide } from '../data/notice.js'
import data from '../data/products.json'
import './ProductDetailPage.css'

const { common, categories } = data
const infoTabs = [
  { key: 'info', label: '상품 정보' },
  { key: 'delivery', label: '배송·보관' },
  { key: 'review', label: '리뷰' },
]

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="stars" aria-label={`별점 ${rating}점`}>
      {'★'.repeat(full)}
      <span className="off">{'★'.repeat(5 - full)}</span>
    </span>
  )
}

// 상품 정보 탭: 소개 문구 → 확대컷 → 샘플 사이즈 → Check Point → 카카오톡 안내
// (detail이 없는 상품은 기본 설명만 보여주고 공통 안내는 똑같이)
function DetailContent({ product }) {
  const detail = product.detail
  const [firstImage, ...restImages] = detail?.images || []

  return (
    <div className="detail-content">
      <div className="intro">
        {(detail?.intro || [product.description]).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {firstImage && <img src={firstImage.src} alt={firstImage.alt} />}
      {detail?.sampleSize && <p className="sample-size">{detail.sampleSize}</p>}
      {restImages.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} />
      ))}

      <div className="check-point">
        <h3>☆Check Point☆</h3>
        <ul>
          {checkPoints.map((point) => (
            <li key={point.title}>
              ☞ {point.title}
              {point.note && <small>({point.note})</small>}
            </li>
          ))}
        </ul>
      </div>

      <div className="kakao-guide">
        <KakaoIcon size={36} />
        {kakaoGuide.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  )
}

function ProductDetail({ product, onCartOpen }) {
  const { addToCart, isWished, toggleWish } = useShop()
  const isCake = product.type === 'cake'
  const options = common.cake.options
  const info = common[product.type]

  const [selected, setSelected] = useState(getDefaultOptions(product))
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('info')
  const [toast, setToast] = useState('')
  const tabsRef = useRef(null)

  // 담기 안내는 2.5초 뒤 사라짐
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const liked = isWished(product.id)
  const total = getUnitPrice(product, selected.size) * qty
  const category = categories.find((c) => c.key === product.category)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6)

  const addCart = () => {
    addToCart(product.id, selected, qty)
    setToast('장바구니에 담았어요')
  }

  // 별점을 누르면 리뷰 탭으로
  const showReviews = () => {
    setTab('review')
    tabsRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="product-detail">
      <div className="photo">
        <img src={product.image} alt={product.title} />
      </div>

      <div className="summary">
        <p className="crumb">
          <Link to={`/products?category=${product.category}`}>{category?.name}</Link>
        </p>
        <div className="badges">
          {product.badges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
        <h2 className="name">{product.title}</h2>
        <button type="button" className="rating" onClick={showReviews}>
          <Stars rating={product.rating} /> {product.rating} <em>({product.reviewCount.toLocaleString()}개 리뷰)</em>
        </button>

        <div className="price-box">
          <p className="original">{formatWon(product.originalPrice)}</p>
          <p className="price">
            <span className="rate">{product.discountRate}%</span>
            {formatWon(getSalePrice(product))}
          </p>
        </div>

        {product.customizable && <p className="notice">📅 커스텀 제작 상품 · {product.leadTime}</p>}
      </div>

      <div className="order">
        {isCake && (
          <>
            <div className="option">
              <h3>호수</h3>
              <div className="choices">
                {options.size.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    aria-pressed={selected.size === size.name}
                    onClick={() => setSelected({ ...selected, size: size.name })}
                  >
                    {size.name}
                    {size.price > 0 && <small>+{size.price.toLocaleString()}</small>}
                  </button>
                ))}
              </div>
            </div>
            <div className="option">
              <h3>맛</h3>
              <div className="choices">
                {options.flavor.map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    aria-pressed={selected.flavor === flavor}
                    onClick={() => setSelected({ ...selected, flavor })}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="qty-row">
          <h3>수량</h3>
          <div className="qty">
            <button type="button" aria-label="수량 빼기" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
              −
            </button>
            <span>{qty}</span>
            <button type="button" aria-label="수량 더하기" disabled={qty >= 99} onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>
        </div>

        <div className="total">
          <span>총 상품 금액</span>
          <strong className="price">{formatWon(total)}</strong>
        </div>

        <div className="order-notice">
          <h3>주문 전 꼭 확인해 주세요</h3>
          <ul>
            {orderNotices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </div>

        <div className="buttons">
          <button
            type="button"
            className={liked ? 'btn-wish on' : 'btn-wish'}
            aria-label={liked ? '찜 해제' : '찜하기'}
            onClick={() => toggleWish(product.id)}
          >
            ♥
          </button>
          <button type="button" className="btn-cart" onClick={addCart}>
            장바구니 담기
          </button>
          {/* 커스텀 상품은 주문제작 신청서로 */}
          {product.customizable ? (
            <Link to={`/order?product=${product.id}`} className="btn-buy">
              주문제작 신청
            </Link>
          ) : (
            <button type="button" className="btn-buy" onClick={() => alert('주문 기능은 준비 중입니다.')}>
              바로 구매
            </button>
          )}
        </div>

        {toast && (
          <div className="toast" role="status">
            {toast}
            <button type="button" onClick={onCartOpen}>
              장바구니 보기 ›
            </button>
          </div>
        )}
      </div>

      <div className="info-tabs" ref={tabsRef}>
        <div className="tab-list" role="tablist">
          {infoTabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
            >
              {item.label}
              {item.key === 'review' && ` (${product.reviewCount.toLocaleString()})`}
            </button>
          ))}
        </div>

        <div className="tab-panel" role="tabpanel">
          {tab === 'info' && (
            <>
              <DetailContent product={product} />
              <ul className="tags">
                {product.hashtags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <dl className="table">
                <dt>카테고리</dt>
                <dd>{category?.name}</dd>
                <dt>커스텀</dt>
                <dd>{product.customizable ? '가능 (문구·사진·피규어)' : '불가'}</dd>
                {product.leadTime && (
                  <>
                    <dt>예약</dt>
                    <dd>{product.leadTime}</dd>
                  </>
                )}
              </dl>
            </>
          )}

          {tab === 'delivery' && (
            <dl className="table">
              <dt>배송 방법</dt>
              <dd>{info.delivery.method.join(', ')}</dd>
              <dt>배송 지역</dt>
              <dd>{info.delivery.region}</dd>
              <dt>배송비</dt>
              <dd>
                {formatWon(info.delivery.fee)} ({formatWon(info.delivery.freeOver)} 이상 무료)
                {info.delivery.overseasFee && <br />}
                {info.delivery.overseasFee && `해외 ${formatWon(info.delivery.overseasFee)}`}
              </dd>
              <dt>보관 방법</dt>
              <dd>{info.storage}</dd>
              {info.allergens && (
                <>
                  <dt>알레르기</dt>
                  <dd>{info.allergens.join(', ')} 함유</dd>
                </>
              )}
            </dl>
          )}

          {tab === 'review' && (
            <>
              <p className="review-summary">
                <Stars rating={product.rating} /> <strong>{product.rating}</strong> · 전체 {product.reviewCount.toLocaleString()}개 중 최근 {product.reviews.length}개
              </p>
              <ul className="reviews">
                {product.reviews.map((review) => (
                  <li key={review.user + review.date}>
                    <Stars rating={review.rating} />
                    <p>{review.content}</p>
                    <small>
                      {review.user} · {review.date}
                    </small>
                  </li>
                ))}
              </ul>
              <Link to={`/reviews?product=${product.id}`} className="review-more">
                이 상품 후기 모두 보기 ›
              </Link>
            </>
          )}
        </div>
      </div>

      {related.length > 0 && <ProductSlider title="함께 보면 좋은" point="케이크" icon="🎂" products={related} />}
    </div>
  )
}

function ProductDetailPage({ onCartOpen }) {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <div className="section not-found">
        <h2 className="section-title">상품을 찾을 수 없어요</h2>
        <p>판매가 끝났거나 주소가 잘못되었어요.</p>
        <Link to="/products">전체 상품 보기 ›</Link>
      </div>
    )
  }

  // 다른 상품으로 이동하면 옵션·수량·탭을 처음 상태로
  return <ProductDetail key={product.id} product={product} onCartOpen={onCartOpen} />
}

export default ProductDetailPage
