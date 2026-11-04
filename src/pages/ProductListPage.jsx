import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useShop } from '../context/useShop.js'
import { categoryMenus } from '../data/menus.js'
import { getProductList, sortOptions, sortProducts } from '../utils/products.js'
import './ProductListPage.css'

// 위쪽 카테고리 칩 (전체 케이크는 '전체'와 겹쳐서 제외)
const chips = [
  { label: '전체', filter: 'all' },
  ...categoryMenus.filter((menu) => menu.filter !== 'cake'),
  { label: '신상품', filter: 'new' },
  { label: '핫딜', filter: 'hot' },
]

function ProductListPage() {
  const [params, setParams] = useSearchParams()
  const { wish } = useShop()

  const q = (params.get('q') || '').trim()
  const category = params.get('category') || 'all'
  const sort = params.get('sort') || 'recommend'

  const info = getProductList({ q, category, wish })
  const list = sortProducts(info.list, sort)

  const changeSort = (e) => {
    const next = new URLSearchParams(params)
    next.set('sort', e.target.value)
    setParams(next, { replace: true })
  }

  return (
    <div className="section product-list-page">
      <h2 className="page-title">{info.name}</h2>

      {!q && (
        <ul className="chips">
          {chips.map((chip) => (
            <li key={chip.filter}>
              <button
                type="button"
                className={category === chip.filter ? 'active' : ''}
                onClick={() => setParams({ category: chip.filter })}
              >
                {chip.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="toolbar">
        <p>
          총 <strong>{list.length}</strong>개
        </p>
        <select value={sort} onChange={changeSort} aria-label="정렬">
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="empty">{info.emptyText}</p>
      ) : (
        <ul className="grid">
          {list.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProductListPage
