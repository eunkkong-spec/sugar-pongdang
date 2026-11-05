import { Link } from 'react-router-dom'
import { useShop } from '../context/useShop.js'

// 로그인·가입 완료, 또는 이미 로그인한 상태일 때 보여주는 화면
function AuthDone({ emoji, title, desc }) {
  const { logout } = useShop()

  return (
    <div className="section auth-page">
      <div className="auth-done">
        <p className="emoji">{emoji}</p>
        <h2>{title}</h2>
        <p>{desc}</p>
        <Link to="/" className="btn-primary">
          쇼핑하러 가기
        </Link>
        <button type="button" className="btn-line" onClick={logout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default AuthDone
