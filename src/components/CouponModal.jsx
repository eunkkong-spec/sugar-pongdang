import { useShop } from '../context/useShop.js'
import { useDrawer } from '../hooks/useDrawer.js'
import { welcomeCoupon } from '../data/coupons.js'
import { formatWon } from '../utils/price.js'
import './CouponModal.css'

function CouponModal({ isOpen, onClose }) {
  const { getCoupon, issueCoupon } = useShop()
  const issued = Boolean(getCoupon(welcomeCoupon.id))
  useDrawer(isOpen, onClose)

  if (!isOpen) return null

  return (
    <div className="coupon-modal">
      <button type="button" className="dim" aria-label="쿠폰 창 닫기" tabIndex={-1} onClick={onClose} />

      <div className="box" role="dialog" aria-modal="true" aria-labelledby="coupon-modal-title">
        <div className="top">
          <h2 id="coupon-modal-title">{welcomeCoupon.name}</h2>
          <button type="button" className="close" aria-label="쿠폰 창 닫기" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={issued ? 'coupon-image issued' : 'coupon-image'}>
          <img src="images/common/coupon2.png" alt={`${welcomeCoupon.name} ${formatWon(welcomeCoupon.amount)}`} />
          {issued && <span className="stamp">받기 완료 ✓</span>}
        </div>
        <p className="terms">
          {welcomeCoupon.condition} · {welcomeCoupon.period}
        </p>

        {issued && <p className="done">쿠폰이 발급되었습니다 🎉</p>}

        <button
          type="button"
          className="btn-get"
          disabled={issued}
          onClick={() => issueCoupon(welcomeCoupon.id, welcomeCoupon.amount)}
        >
          {issued ? '받기 완료' : '쿠폰 받기'}
        </button>
      </div>
    </div>
  )
}

export default CouponModal
