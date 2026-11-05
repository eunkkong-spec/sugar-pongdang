import data from '../data/products.json'
import { getUnitPrice } from './price.js'

const { size, flavor } = data.common.cake.options
const { fee, freeOver } = data.common.cake.delivery

// 케이크 기본 옵션 (상품 카드의 🛒 버튼, 예전 장바구니 변환에 사용)
export function getDefaultOptions(product) {
  if (product?.type !== 'cake') return { size: null, flavor: null }
  return { size: size[0].name, flavor: flavor[0] }
}

// 같은 상품이라도 옵션이 다르면 다른 줄로 담기
export function makeCartKey(id, options) {
  return [id, options.size, options.flavor].filter(Boolean).join('-')
}

// "2호 / 초코" 처럼 보여줄 옵션 글자
export function formatOptions(item) {
  return [item.size, item.flavor].filter(Boolean).join(' / ')
}

// 주문 금액 계산 (장바구니·결제 페이지 공통)
// 무료배송 기준은 할인 전 금액, 쿠폰은 상품 금액을 넘지 않게
export function getOrderSummary(lines, coupon) {
  const items = lines
    .map((line) => ({ ...line, product: data.products.find((p) => p.id === line.id) }))
    .filter((item) => item.product)
  const total = items.reduce((sum, item) => sum + getUnitPrice(item.product, item.size) * item.qty, 0)
  const delivery = total === 0 || total >= freeOver ? 0 : fee
  const discount = coupon ? Math.min(coupon.amount, total) : 0
  return { items, total, delivery, discount, pay: total + delivery - discount, remain: freeOver - total }
}

// 결제창에 보여줄 주문 이름: "블루 레이스 액자 포토 케이크 외 2건"
export function getOrderName(items) {
  if (!items.length) return ''
  const first = items[0].product.title
  return items.length > 1 ? `${first} 외 ${items.length - 1}건` : first
}
