import { useRef } from 'react'
import ProductCard from './ProductCard.jsx'
import './ProductSlider.css'

function ProductSlider({ id, title, point, icon, products }) {
  const listRef = useRef(null)

  // 카드 한 장 너비만큼 이동
  const move = (dir) => {
    const list = listRef.current
    list.scrollBy({ left: dir * list.firstChild.offsetWidth, behavior: 'smooth' })
  }

  return (
    <section className="section product-slider" id={id}>
      <div className="head">
        <h2 className="section-title">
          {title} <em>{point}</em>
          <span>{icon}</span>
        </h2>
        <div className="arrows">
          <button type="button" aria-label="이전" onClick={() => move(-1)}>‹</button>
          <button type="button" aria-label="다음" onClick={() => move(1)}>›</button>
        </div>
      </div>

      <ul className="list" ref={listRef}>
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProductSlider
