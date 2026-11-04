import { contact } from '../data/contact.js'
import './Footer.css'

const links = ['회사소개', '이용약관', '개인정보처리방침', '이용안내']

function Footer() {
  return (
    <footer className="footer">
      <div className="brand">
        <img src="images/common/logo.png" alt="슈가퐁당" />
        <p className="slogan">세상에 하나뿐인 커스텀 케이크</p>
      </div>

      <div className="cs">
        <h3>고객센터</h3>
        <p className="tel">{contact.tel}</p>
        <p>평일 오전 10:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</p>
        <p>주말 및 공휴일 휴무</p>

        <h3>계좌안내</h3>
        <p>신한은행 000-000-000000</p>
        <p>예금주 슈가퐁당</p>

        <a href={`tel:${contact.tel}`} className="call">전화문의</a>
      </div>

      <ul className="links">
        {links.map((link) => (
          <li key={link}>
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>

      <div className="company">
        <p>상호 : 슈가퐁당 | 대표 : 홍길동</p>
        <p>사업자등록번호 : 000-00-00000 | 통신판매업 신고 : 제0000-서울-0000호</p>
        <p>주소 : 서울특별시 OO구 OO로 00</p>
        <p>이메일 : hello@sugarpongdang.com</p>
        <p className="copy">Copyright © 슈가퐁당. All rights reserved.</p>
        <p className="original">🚫 Original Only. Copy No!</p>
      </div>

      <p className="portfolio">
        본 사이트는 <strong>포트폴리오용</strong>으로 제작되었습니다.
        <br />
        상품 리뷰, 주소, 연락처, 사업자 정보 등은 모두 가상의 정보이며 실제 주문·결제는 이루어지지 않습니다.
      </p>
    </footer>
  )
}

export default Footer
