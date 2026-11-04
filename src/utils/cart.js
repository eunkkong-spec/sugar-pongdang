import data from '../data/products.json'

const { size, flavor } = data.common.cake.options

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
