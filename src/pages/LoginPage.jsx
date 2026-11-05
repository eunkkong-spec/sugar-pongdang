import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import SocialButtons from '../components/SocialButtons.jsx'
import AuthDone from './AuthDone.jsx'
import './AuthPage.css'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const { user, login } = useShop()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  if (user) {
    return done ? (
      <AuthDone emoji="🎂" title={`${user.name}님, 반가워요!`} desc="로그인되었어요. 달콤한 쇼핑 되세요." />
    ) : (
      <AuthDone emoji="🙂" title="이미 로그인되어 있어요" desc={`${user.name}님으로 로그인 중이에요.`} />
    )
  }

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const finish = (info) => {
    login(info)
    setDone(true)
    window.scrollTo(0, 0)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!EMAIL.test(form.email.trim())) next.email = '이메일 주소를 확인해 주세요.'
    if (!form.password) next.password = '비밀번호를 입력해 주세요.'
    setErrors(next)
    if (Object.keys(next).length) return
    finish({ name: form.email.split('@')[0], provider: 'email' })
  }

  return (
    <div className="section auth-page">
      <img src="images/common/logo.png" alt="슈가퐁당" className="logo" />
      <h2 className="title">로그인</h2>

      <form onSubmit={submit} noValidate>
        <label htmlFor="login-email">이메일</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="sugar@example.com"
          value={form.email}
          aria-invalid={Boolean(errors.email)}
          onChange={(e) => update('email', e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="login-password">비밀번호</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          aria-invalid={Boolean(errors.password)}
          onChange={(e) => update('password', e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" className="btn-primary">
          로그인
        </button>
      </form>

      <div className="links">
        <Link to="/join">회원가입</Link>
        <span>|</span>
        <button type="button" onClick={() => alert('포트폴리오용 데모라 비밀번호 찾기는 준비 중이에요.')}>
          비밀번호 찾기
        </button>
      </div>

      <p className="divider">간편 로그인</p>
      <SocialButtons label="시작하기" onLogin={finish} />
      <p className="demo">※ 포트폴리오용 데모 로그인이에요. 실제 인증은 하지 않아요.</p>
    </div>
  )
}

export default LoginPage
