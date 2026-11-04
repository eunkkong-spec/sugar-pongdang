import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import data from '../data/products.json'
import './StyleGuide.css'

const colorGroups = [
  { title: 'Peach', names: ['peach-50', 'peach-100', 'peach-300', 'peach-500', 'peach-700'] },
  { title: 'Pistachio', names: ['pistachio-100', 'pistachio-300', 'pistachio-500', 'pistachio-700'] },
  { title: 'Base', names: ['choco', 'gray', 'line', 'sale', 'white'] },
  { title: 'Brand · 기타', names: ['kakao', 'kakao-brown', 'insta-purple', 'insta-pink', 'insta-orange', 'dim'] },
]

const fontSizes = [
  { name: 'fs-hero', use: '메인 배너, 주말특가 제목' },
  { name: 'fs-section', use: '섹션 제목' },
  { name: 'fs-price', use: '판매가' },
  { name: 'fs-name', use: '상품명, 본문 강조' },
  { name: 'fs-desc', use: '설명, 입력창' },
  { name: 'fs-small', use: '원가, 메뉴 라벨, 보조 글' },
  { name: 'fs-badge', use: '배지, 태그' },
]

const spaces = [4, 8, 12, 16, 20, 24, 32, 40]

// variables.css에 정의된 실제 값 읽기
function readVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}

function StyleGuide() {
  // 화면 폭이 768px 기준을 넘나들면 글자 크기 값이 바뀌므로 다시 읽기
  const [, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="style-guide">
      <header className="sg-header">
        <Link to="/" className="back">← 메인으로</Link>
        <h1>슈가퐁당 스타일 가이드</h1>
        <p>모든 값은 src/variables.css에서 읽어옵니다. 색상·글꼴은 이 파일에 있는 것만 사용합니다.</p>
      </header>

      <section className="sg-section">
        <h2>색상</h2>
        {colorGroups.map((group) => (
          <div key={group.title} className="color-group">
            <h3>{group.title}</h3>
            <ul className="swatches">
              {group.names.map((name) => (
                <li key={name}>
                  <span className="chip" style={{ background: `var(--${name})` }} />
                  <strong>--{name}</strong>
                  <code>{readVar(name)}</code>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="sg-section">
        <h2>글꼴</h2>
        <div className="font-sample">
          <p className="title-font">달콤한 하루, 슈가퐁당</p>
          <code>--font-title · Cafe24Ssurround (h1, h2)</code>
        </div>
        <div className="font-sample">
          <p className="body-font">소중한 날을 위한 커스텀 케이크 0123456789</p>
          <code>--font-body · Pretendard (본문)</code>
        </div>
      </section>

      <section className="sg-section">
        <h2>글자 크기</h2>
        <p className="note">768px 이하 화면에서는 작은 값이 적용됩니다. 지금 화면 기준 값을 보여줍니다.</p>
        <ul className="type-scale">
          {fontSizes.map((size) => (
            <li key={size.name}>
              <span className="sample" style={{ fontSize: `var(--${size.name})` }}>슈가퐁당 케이크</span>
              <code>--{size.name} · {readVar(size.name)}</code>
              <small>{size.use}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="sg-section">
        <h2>둥글기</h2>
        <ul className="radius-list">
          <li>
            <span className="box card" />
            <code>--radius-card · {readVar('radius-card')}</code>
            <small>카드, 이미지, 아이콘 칸</small>
          </li>
          <li>
            <span className="box badge" />
            <code>--radius-badge · {readVar('radius-badge')}</code>
            <small>배지, 알약 버튼, 입력창</small>
          </li>
        </ul>
      </section>

      <section className="sg-section">
        <h2>간격</h2>
        <p className="note">margin · padding · gap은 4의 배수만 사용합니다.</p>
        <ul className="space-list">
          {spaces.map((space) => (
            <li key={space}>
              <span className="bar" style={{ width: `${space * 4}px` }} />
              <code>{space}px</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="sg-section">
        <h2>컴포넌트</h2>

        <h3>버튼</h3>
        <div className="row">
          <button type="button" className="btn primary">회원가입</button>
          <button type="button" className="btn outline">로그인</button>
          <button type="button" className="btn dark">카톡 상담하기</button>
        </div>

        <h3>배지</h3>
        <div className="row">
          <span className="badge-sample">NEW</span>
          <span className="badge-sample sale">SALE</span>
          <span className="badge-sample count">2</span>
        </div>

        <h3>섹션 제목</h3>
        <h2 className="section-title">
          주문폭주 <em>인기상품</em>
        </h2>

        <h3>상품 카드</h3>
        <div className="card-sample">
          <ProductCard product={data.products[0]} />
          <ProductCard product={data.products[1]} />
        </div>
      </section>
    </div>
  )
}

export default StyleGuide
