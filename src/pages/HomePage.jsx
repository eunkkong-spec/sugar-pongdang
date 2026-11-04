import MainVisual from '../components/MainVisual.jsx'
import NoticeBar from '../components/NoticeBar.jsx'
import IconMenu from '../components/IconMenu.jsx'
import WeekendDeal from '../components/WeekendDeal.jsx'
import CouponBanner from '../components/CouponBanner.jsx'
import ProductSlider from '../components/ProductSlider.jsx'
import CelebGallery from '../components/CelebGallery.jsx'
import ReviewEvent from '../components/ReviewEvent.jsx'
import ReviewSection from '../components/ReviewSection.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Instagram from '../components/Instagram.jsx'
import { weekendProducts, newProducts, bestProducts, recommendProducts } from '../utils/products.js'

function HomePage({ onSelectMenu, onCouponOpen }) {
  return (
    <>
      <MainVisual />
      <NoticeBar />
      <IconMenu onSelect={onSelectMenu} />
      <WeekendDeal products={weekendProducts} />
      <CouponBanner onOpen={onCouponOpen} />
      <ProductSlider id="new-products" title="NEW" point="신상품" icon="🛍️" products={newProducts} />
      <ProductSlider id="best-products" title="주문폭주" point="인기상품" icon="👑" products={bestProducts} />
      <CelebGallery />
      <ReviewEvent />
      <ReviewSection />
      <ProductGrid
        title={
          <>
            <em>특별한 추억</em>으로 축하를 전해요
          </>
        }
        icon="🍰"
        products={recommendProducts}
      />
      <Instagram />
    </>
  )
}

export default HomePage
