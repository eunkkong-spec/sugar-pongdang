import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { allReviews, reviewSortOptions, sortReviews, summarize } from '../utils/reviews.js'
import { products } from '../utils/products.js'
import './ReviewsPage.css'

const PAGE_SIZE = 10

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="stars" aria-label={`별점 ${rating}점`}>
      {'★'.repeat(full)}
      <span className="off">{'★'.repeat(5 - full)}</span>
    </span>
  )
}

// 긴 후기는 3줄까지 접었다가 더보기로 펼치기 (실제로 잘렸을 때만 버튼 표시)
function ReviewItem({ review }) {
  const [open, setOpen] = useState(false)
  const [isLong, setIsLong] = useState(false)
  const contentRef = useRef(null)

  useLayoutEffect(() => {
    const el = contentRef.current
    setIsLong(el.scrollHeight > el.clientHeight + 1)
  }, [])

  return (
    <li className="review-item">
      <div className="top">
        <Stars rating={review.rating} />
        <span className="meta">
          {review.user} · {review.date.replaceAll('-', '.')}
        </span>
      </div>
      {review.productId ? (
        <Link to={`/product/${review.productId}`} className="product">
          {review.productTitle} ›
        </Link>
      ) : (
        <p className="product">{review.productTitle}</p>
      )}
      <div className="body">
        <p ref={contentRef} className={open ? 'content' : 'content clamp'}>
          {review.content}
        </p>
        {review.image && <img src={review.image} alt={`${review.productTitle} 포토후기`} />}
      </div>
      {isLong && (
        <button type="button" className="toggle" onClick={() => setOpen(!open)}>
          {open ? '접기' : '더보기'}
        </button>
      )}
    </li>
  )
}

function ReviewsPage() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'photo' ? 'photo' : 'all'
  const sort = params.get('sort') || 'latest'
  const product = products.find((p) => p.id === Number(params.get('product')))
  const [visible, setVisible] = useState(PAGE_SIZE)

  // 상품 상세에서 들어오면 그 상품 후기만
  const base = product ? allReviews.filter((r) => r.productId === product.id) : allReviews
  const photoReviews = base.filter((r) => r.image)
  const list = sortReviews(tab === 'photo' ? photoReviews : base, sort)
  const summary = summarize(base)

  // 탭·정렬을 바꾸면 처음 10개부터 다시
  const change = (key, value) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next, { replace: true })
    setVisible(PAGE_SIZE)
  }

  return (
    <div className="section reviews-page">
      <h2 className="page-title">{product ? `${product.title} 후기` : '고객 후기'}</h2>
      {product && (
        <Link to="/reviews" className="all-link">
          전체 후기 보기 ›
        </Link>
      )}

      <div className="summary">
        <div className="score">
          <strong>{summary.average.toFixed(1)}</strong>
          <Stars rating={summary.average} />
          <p>후기 {summary.total}개</p>
        </div>
        <ul className="bars">
          {summary.counts.map(({ star, percent }) => (
            <li key={star}>
              <span>{star}점</span>
              <span className="bar">
                <span style={{ width: `${percent}%` }} />
              </span>
              <span>{percent}%</span>
            </li>
          ))}
        </ul>
      </div>

      {tab === 'all' && photoReviews.length > 0 && (
        <div className="photo-strip">
          <p>포토후기 모아보기</p>
          <ul>
            {photoReviews.map((review) => (
              <li key={review.id}>
                <button type="button" onClick={() => change('tab', 'photo')}>
                  <img src={review.image} alt={`${review.productTitle} 포토후기`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="toolbar">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'all'} onClick={() => change('tab', 'all')}>
            전체 {base.length}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'photo'} onClick={() => change('tab', 'photo')}>
            📷 포토후기 {photoReviews.length}
          </button>
        </div>
        <select value={sort} onChange={(e) => change('sort', e.target.value)} aria-label="정렬">
          {reviewSortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="empty">{tab === 'photo' ? '아직 포토후기가 없어요.' : '아직 후기가 없어요.'}</p>
      ) : (
        <ul className="list">
          {list.slice(0, visible).map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      )}

      {visible < list.length && (
        <button type="button" className="more" onClick={() => setVisible(visible + PAGE_SIZE)}>
          더보기 ({visible}/{list.length})
        </button>
      )}
    </div>
  )
}

export default ReviewsPage
