import { welcomeCoupon } from '../data/coupons.js'
import { formatWon } from '../utils/price.js'
import './CouponBanner.css'

// 쿠폰 배너 이미지: 누르면(쿠폰받기 포함) 쿠폰 받기 창 열기
function CouponBanner({ onOpen }) {
  return (
    <section className="coupon-banner">
      <button type="button" onClick={onOpen} aria-label={`${welcomeCoupon.name} ${formatWon(welcomeCoupon.amount)} 받기`}>
        <img
          src="images/common/coupon-banner3.png"
          alt={`${welcomeCoupon.name} ${formatWon(welcomeCoupon.amount)} - 신규 가입회원에게 할인 쿠폰을 드립니다.`}
        />
      </button>
    </section>
  )
}

export default CouponBanner
