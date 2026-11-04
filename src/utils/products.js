import data from '../data/products.json'
import { getSalePrice } from './price.js'

export const products = data.products
const categories = data.categories

// 메인 섹션용 목록
// 할인율 높은 순 2개
export const weekendProducts = [...products].sort((a, b) => b.discountRate - a.discountRate).slice(0, 2)
// NEW 배지 상품
export const newProducts = products.filter((p) => p.badges.includes('NEW'))
// 리뷰 많은 순 8개
export const bestProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8)
// 위에 나오지 않은 상품 10개
const shownIds = [...weekendProducts, ...newProducts, ...bestProducts].map((p) => p.id)
export const recommendProducts = products.filter((p) => !shownIds.includes(p.id)).slice(0, 10)

// 카테고리 외 목록
const filters = {
  all: { name: '전체상품', list: products },
  new: { name: '신상품', list: newProducts },
  hot: { name: '핫딜', list: products.filter((p) => p.discountRate >= 15) },
  cake: { name: '전체 케이크', list: products.filter((p) => p.type === 'cake') },
}

// 상품 목록 페이지: 검색어 > 찜 > 카테고리 순으로 결정
export function getProductList({ q, category, wish }) {
  if (q) {
    return {
      name: `'${q}' 검색 결과`,
      list: products.filter((p) => [p.title, p.description, ...p.hashtags].join(' ').includes(q)),
      emptyText: '검색 결과가 없습니다.',
    }
  }
  if (category === 'wish') {
    return { name: '찜한 상품', list: products.filter((p) => wish.includes(p.id)), emptyText: '찜한 상품이 없습니다.' }
  }
  if (filters[category]) return { ...filters[category], emptyText: '상품이 없습니다.' }

  const found = categories.find((c) => c.key === category)
  if (!found) return { name: '상품 목록', list: [], emptyText: '찾는 카테고리가 없습니다.' }
  return {
    name: category === 'topper' ? found.name : `${found.name} 케이크`,
    list: products.filter((p) => p.category === category),
    emptyText: '상품이 없습니다.',
  }
}

export const sortOptions = [
  { value: 'recommend', label: '추천순' },
  { value: 'popular', label: '인기순' },
  { value: 'low', label: '낮은 가격순' },
  { value: 'high', label: '높은 가격순' },
  { value: 'discount', label: '할인율순' },
]

// 추천순은 원래 순서 그대로
export function sortProducts(list, sort) {
  const copy = [...list]
  if (sort === 'popular') return copy.sort((a, b) => b.reviewCount - a.reviewCount)
  if (sort === 'low') return copy.sort((a, b) => getSalePrice(a) - getSalePrice(b))
  if (sort === 'high') return copy.sort((a, b) => getSalePrice(b) - getSalePrice(a))
  if (sort === 'discount') return copy.sort((a, b) => b.discountRate - a.discountRate)
  return copy
}
