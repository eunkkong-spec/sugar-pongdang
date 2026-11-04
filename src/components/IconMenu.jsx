import { mainMenus, categoryMenus } from '../data/menus.js'
import './IconMenu.css'

function IconMenu({ onSelect }) {
  return (
    <nav className="icon-menu">
      <ul>
        {mainMenus.map((menu) => (
          <li key={menu.label}>
            <button type="button" onClick={() => onSelect(menu)}>
              <span className={`icon ${menu.type}`}>{menu.icon}</span>
              {menu.label}
            </button>
          </li>
        ))}
      </ul>
      <ul className="category-list">
        {categoryMenus.map((menu) => (
          <li key={menu.label}>
            <button type="button" onClick={() => onSelect(menu)}>
              <img className="icon category" src={`images/icons/icon_${menu.icon}.png`} alt="" />
              {menu.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default IconMenu
