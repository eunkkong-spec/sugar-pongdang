import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reviews } from '../data/reviews.js'
import './DesktopSide.css'

// 넓은 화면(PC)에서 쇼핑몰 왼쪽에 보이는 포토후기 슬라이드
const photoReviews = reviews.filter((review) => review.image)

function DesktopSide() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const review = photoReviews[index]
  const move = (step) => setIndex((i) => (i + step + photoReviews.length) % photoReviews.length)

  // 4초마다 다음 후기로 (마우스를 올리면 멈춤)
  useEffect(() => {
    if (paused) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % photoReviews.length), 4000)
    return () => clearInterval(timer)
  }, [paused])

  return (
    <aside className="desktop-side" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <img className="logo" src="images/common/logo.png" alt="슈가퐁당" />
      <p className="slogan">세상에 하나뿐인 커스텀 케이크</p>

      <h2>★ REAL PHOTO REVIEW</h2>
      <Link to="/reviews" className="card">
        <img src={review.image} alt={`${review.product} 후기 사진`} />
        <div className="text">
          <p className="meta">
            <span className="stars">{'★'.repeat(review.rating)}</span> {review.user}
          </p>
          <p className="content">{review.content}</p>
          <p className="product">{review.product}</p>
        </div>
      </Link>

      <div className="controls">
        <button type="button" aria-label="이전 후기" onClick={() => move(-1)}>
          ‹
        </button>
        <div className="dots">
          {photoReviews.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${i + 1}번째 후기`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" aria-label="다음 후기" onClick={() => move(1)}>
          ›
        </button>
      </div>

      <Link to="/reviews" className="btn-more">
        포토후기 전체 보기 ›
      </Link>
    </aside>
  )
}

export default DesktopSide
