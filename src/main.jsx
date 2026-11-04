import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './variables.css'
import { ShopProvider } from './context/ShopProvider.jsx'
import App from './App.jsx'

// HashRouter: 주소를 #/products 처럼 써서 dist/index.html을 더블클릭해도 페이지 이동이 되게
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ShopProvider>
        <App />
      </ShopProvider>
    </HashRouter>
  </StrictMode>,
)
