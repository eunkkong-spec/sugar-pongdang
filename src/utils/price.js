import data from '../data/products.json'

const sizeOptions = data.common.cake.options.size

// 할인가는 100원 단위로 반올림
export function getSalePrice(product) {
  return Math.round((product.originalPrice * (100 - product.discountRate)) / 10000) * 100
}

// 호수 추가 금액 (1호 0원, 2호 +15,000원 …)
export function getSizePrice(size) {
  return sizeOptions.find((option) => option.name === size)?.price || 0
}

// 옵션까지 더한 1개 가격
export function getUnitPrice(product, size) {
  return getSalePrice(product) + getSizePrice(size)
}

export function formatWon(value) {
  return `${value.toLocaleString()}원`
}
