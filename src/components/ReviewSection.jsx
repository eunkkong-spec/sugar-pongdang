import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { reviews } from '../data/reviews.js'
import './ReviewSection.css'

// 포토후기를 앞에, 나머지는 원래 순서대로
const sortedReviews = [...reviews].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))

function ReviewSection() {
  const listRef = useRef(null)

  // 카드 한 장 너비만큼 이동
  const move = (dir) => {
    const list = listRef.current
    list.scrollBy({ left: dir * list.firstChild.offsetWidth, behavior: 'smooth' })
  }

  return (
    <section className="section review-section" id="reviews">
      <div className="head">
        <h2 className="section-title">
          고객님들의 <em>달콤한 후기</em>
        </h2>
        <Link to="/reviews" className="more">
          전체보기 ›
        </Link>
      </div>

      <ul className="list" ref={listRef}>
        {sortedReviews.map((review) => (
          <li key={review.id}>
            <Link to={review.image ? '/reviews?tab=photo' : '/reviews'} className="card">
              {review.image && (
                <div className="photo">
                  <img src={review.image} alt={`${review.product} 포토후기`} />
                  <span className="photo-badge">포토</span>
                </div>
              )}
              <div className="body">
                <span className="stars" aria-label={`별점 ${review.rating}점`}>
                  {'★'.repeat(review.rating)}
                  <span className="empty">{'★'.repeat(5 - review.rating)}</span>
                </span>
                <p className="content">{review.content}</p>
                <p className="product">{review.product}</p>
                <p className="meta">
                  {review.user} · {review.date}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="arrows">
        <button type="button" aria-label="이전 후기" onClick={() => move(-1)}>‹</button>
        <button type="button" aria-label="다음 후기" onClick={() => move(1)}>›</button>
      </div>
    </section>
  )
}

export default ReviewSection
