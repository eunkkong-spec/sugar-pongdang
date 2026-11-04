import { reviews as mainReviews } from '../data/reviews.js'
import { products } from './products.js'

// 메인 후기 + 상품별 후기를 같은 모양으로 합치기
// { id, user, rating, date(YYYY-MM-DD), content, image?, productId?, productTitle }
const fromMain = mainReviews.map((review) => {
  const product = products.find((p) => p.title === review.product)
  return {
    id: `main-${review.id}`,
    user: review.user,
    rating: review.rating,
    date: review.date.replaceAll('.', '-'),
    content: review.content,
    image: review.image,
    productId: product?.id,
    productTitle: review.product,
  }
})

const fromProducts = products.flatMap((product) =>
  product.reviews.map((review, index) => ({
    id: `p${product.id}-${index}`,
    user: review.user,
    rating: review.rating,
    date: review.date,
    content: review.content,
    productId: product.id,
    productTitle: product.title,
  })),
)

export const allReviews = [...fromMain, ...fromProducts]

export const reviewSortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'high', label: '별점 높은순' },
  { value: 'low', label: '별점 낮은순' },
]

export function sortReviews(list, sort) {
  const copy = [...list]
  if (sort === 'high') return copy.sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))
  if (sort === 'low') return copy.sort((a, b) => a.rating - b.rating || b.date.localeCompare(a.date))
  return copy.sort((a, b) => b.date.localeCompare(a.date))
}

// 평균 별점과 별점별 비율 (4.5점은 4점 칸에 셈)
export function summarize(list) {
  const total = list.length
  const average = total ? list.reduce((sum, r) => sum + r.rating, 0) / total : 0
  const counts = [5, 4, 3, 2, 1].map((star) => {
    const count = list.filter((r) => Math.floor(r.rating) === star).length
    return { star, count, percent: total ? Math.round((count / total) * 100) : 0 }
  })
  return { total, average, counts }
}
