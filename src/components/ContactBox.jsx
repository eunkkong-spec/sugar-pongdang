import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import KakaoIcon from './KakaoIcon.jsx'
import './ContactBox.css'

function ContactBox() {
  return (
    <section className="contact-box">
      <div className="item">
        <div className="text">
          <h2>카톡 상담으로 문의하기!</h2>
          <p>디자인, 픽업·배송 등 빠른 문의가 필요하시다면 카톡 상담으로 간편하게 문의하세요. DM 보단 카카오톡이 빠릅니다.</p>
        </div>
        <div className="action">
          <span className="kakao">
            <KakaoIcon size={28} />
          </span>
          <a href="#">카톡 상담하기</a>
        </div>
      </div>

      <div className="item">
        <div className="text">
          <h2>단체·대량 주문 문의</h2>
          <p>행사, 기업 선물 등 대량 주문이 필요하시다면 상담을 통해 소통해 보세요.</p>
        </div>
        <div className="action">
          <FontAwesomeIcon icon={faPhoneVolume} className="phone" aria-hidden="true" />
          <a href="#">단체주문 문의</a>
        </div>
      </div>
    </section>
  )
}

export default ContactBox
