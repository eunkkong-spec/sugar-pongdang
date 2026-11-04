import { useId } from 'react'
import './Instagram.css'

const photos = ['cake_07', 'cake_10', 'cake_15', 'cake_22', 'cake_26', 'cake_27']

// 인스타그램 아이콘: 그라데이션 둥근 네모 + 흰 선 카메라 (여러 개 써도 그라데이션 id가 겹치지 않게 useId)
function InstagramIcon({ size }) {
  const gradientId = useId()

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--insta-orange)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--insta-pink)' }} />
          <stop offset="1" style={{ stopColor: 'var(--insta-purple)' }} />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#${gradientId})`} />
      <rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="var(--white)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="var(--white)" strokeWidth="1.8" />
      <circle cx="16.3" cy="7.7" r="1" fill="var(--white)" />
    </svg>
  )
}

function Instagram() {
  return (
    <section className="section instagram">
      <div className="head">
        <h2>
          <InstagramIcon size={28} />
          Instagram
        </h2>
        <a href="#" className="follow">
          <InstagramIcon size={16} />
          follow us
        </a>
      </div>

      <ul className="list">
        {photos.map((name) => (
          <li key={name}>
            <a href="#">
              <img src={`images/cakes/${name}.jpg`} alt="슈가퐁당 인스타그램 사진" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Instagram
