import { useEffect, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import './WeekendDeal.css'

// 이번 주 일요일 23:59:59까지 남은 시간
function getTimeLeft() {
  const now = new Date()
  const end = new Date(now)
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7))
  end.setHours(23, 59, 59, 999)

  const sec = Math.floor((end - now) / 1000)
  const day = Math.floor(sec / 86400)
  const pad = (n) => String(n).padStart(2, '0')
  const time = `${pad(Math.floor((sec % 86400) / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`

  return day > 0 ? `${day}일 ${time}` : time
}

function WeekendDeal({ products }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="section weekend-deal" id="weekend-deal">
      <h2 className="section-title">
        <span className="tag">SALE</span>주말특가<span>🎁</span>
      </h2>
      <p className="sub-title">일주일에 단 한번 특별한 세일</p>

      <div className="list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} label="할인특가">
            <div className="countdown">
              <strong>{timeLeft}</strong>
              <span>남음</span>
            </div>
          </ProductCard>
        ))}
      </div>
    </section>
  )
}

export default WeekendDeal
