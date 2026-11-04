import { useShop } from '../context/useShop.js'
import { useDrawer } from '../hooks/useDrawer.js'
import { mainMenus, categoryMenus } from '../data/menus.js'
import { contact } from '../data/contact.js'
import './SideMenu.css'

function SideMenu({ isOpen, onClose, onSelect }) {
  const { wish } = useShop()
  useDrawer(isOpen, onClose)

  const select = (menu) => {
    onClose()
    onSelect(menu, true)
  }

  return (
    <div className={isOpen ? 'side-menu open' : 'side-menu'} inert={!isOpen}>
      <button type="button" className="dim" aria-label="메뉴 닫기" tabIndex={-1} onClick={onClose} />

      <aside className="panel">
        <div className="top">
          <div className="member">
            <a href="#" className="login">로그인</a>
            <a href="#" className="join">회원가입</a>
          </div>
          <button type="button" className="close" aria-label="메뉴 닫기" onClick={onClose}>
            ✕
          </button>
        </div>

        <button type="button" className="wish" onClick={() => select({ filter: 'wish' })}>
          <span>♥ 찜한 상품</span>
          <em>{wish.length}</em>
        </button>
        <button type="button" className="order-link" onClick={() => select({ path: '/order' })}>
          ✍️ 주문제작 신청하기 ›
        </button>

        <h2>카테고리</h2>
        <ul className="category">
          {categoryMenus.map((menu) => (
            <li key={menu.label}>
              <button type="button" onClick={() => select(menu)}>
                <img src={`images/icons/icon_${menu.icon}.png`} alt="" />
                {menu.label}
              </button>
            </li>
          ))}
        </ul>

        <h2>쇼핑</h2>
        <ul className="shop">
          {mainMenus.map((menu) => (
            <li key={menu.label}>
              <button type="button" onClick={() => select(menu)}>
                {menu.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="cs">
          <p>고객센터</p>
          <a href={`tel:${contact.tel}`}>{contact.tel}</a>
          <p>평일 10:00 ~ 18:00 (주말·공휴일 휴무)</p>
        </div>
      </aside>
    </div>
  )
}

export default SideMenu
