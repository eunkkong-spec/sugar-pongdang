import { useRef } from 'react'
import { celebs } from '../data/celebs.js'
import './CelebGallery.css'

function CelebGallery() {
  const listRef = useRef(null)

  // 사진 한 장 너비만큼 이동
  const move = (dir) => {
    const list = listRef.current
    list.scrollBy({ left: dir * list.firstChild.offsetWidth, behavior: 'smooth' })
  }

  return (
    <section className="section celeb-gallery" id="celeb">
      <div className="head">
        <h2 className="section-title">
          스타들도 <em>슈가퐁당</em>
          <span>🌟</span>
        </h2>
        <div className="arrows">
          <button type="button" aria-label="이전" onClick={() => move(-1)}>‹</button>
          <button type="button" aria-label="다음" onClick={() => move(1)}>›</button>
        </div>
      </div>

      <ul className="list" ref={listRef}>
        {celebs.map((celeb) => (
          <li key={celeb.id}>
            <img src={celeb.image} alt={`${celeb.name} ${celeb.title}`} />
            <strong>{celeb.name}</strong>
            <p>{celeb.title}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CelebGallery
