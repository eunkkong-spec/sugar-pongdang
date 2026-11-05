import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/useShop.js'
import SocialButtons from '../components/SocialButtons.jsx'
import AuthDone from './AuthDone.jsx'
import './AuthPage.css'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^01[016789]-?\d{3,4}-?\d{4}$/
const TERMS = [
  { key: 'terms', label: '[필수] 이용약관 동의', required: true },
  { key: 'privacy', label: '[필수] 개인정보 수집·이용 동의', required: true },
  { key: 'marketing', label: '[선택] 할인·이벤트 소식 받기', required: false },
]

// 입력 확인 (틀린 칸: 안내 문구)
function validate(form, agree) {
  const errors = {}
  if (!form.name.trim()) errors.name = '이름을 입력해 주세요.'
  if (!EMAIL.test(form.email.trim())) errors.email = '이메일 주소를 확인해 주세요.'
  if (form.password.length < 8) errors.password = '비밀번호는 8자 이상이에요.'
  if (form.passwordCheck !== form.password || !form.passwordCheck) errors.passwordCheck = '비밀번호가 서로 달라요.'
  if (!PHONE.test(form.phone.trim())) errors.phone = '휴대폰 번호를 010-0000-0000 형식으로 적어 주세요.'
  if (TERMS.some((t) => t.required && !agree[t.key])) errors.agree = '필수 약관에 동의해 주세요.'
  return errors
}

function JoinPage() {
  const { user, login } = useShop()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordCheck: '', phone: '' })
  const [agree, setAgree] = useState({ terms: false, privacy: false, marketing: false })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  if (user) {
    return done ? (
      <AuthDone emoji="🎉" title={`${user.name}님, 가입을 환영해요!`} desc="신규 가입 쿠폰 3,000원도 잊지 말고 받아 가세요." />
    ) : (
      <AuthDone emoji="🙂" title="이미 로그인되어 있어요" desc={`${user.name}님으로 로그인 중이에요.`} />
    )
  }

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const allAgreed = TERMS.every((t) => agree[t.key])
  const toggleAll = () => {
    setAgree(Object.fromEntries(TERMS.map((t) => [t.key, !allAgreed])))
    setErrors((prev) => ({ ...prev, agree: undefined }))
  }

  const finish = (info) => {
    login(info)
    setDone(true)
    window.scrollTo(0, 0)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = validate(form, agree)
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      document.getElementById(`join-${first}`)?.focus()
      return
    }
    finish({ name: form.name.trim(), provider: 'email' })
  }

  const field = (key, label, type, extra = {}) => (
    <>
      <label htmlFor={`join-${key}`}>{label}</label>
      <input
        id={`join-${key}`}
        type={type}
        value={form[key]}
        aria-invalid={Boolean(errors[key])}
        onChange={(e) => update(key, e.target.value)}
        {...extra}
      />
      {errors[key] && <p className="error">{errors[key]}</p>}
    </>
  )

  return (
    <div className="section auth-page">
      <img src="images/common/logo.png" alt="슈가퐁당" className="logo" />
      <h2 className="title">회원가입</h2>

      <p className="quick">3초 만에 가입하기</p>
      <SocialButtons label="가입하기" onLogin={finish} />

      <p className="divider">또는 이메일로 가입</p>
      <form onSubmit={submit} noValidate>
        {field('name', '이름', 'text', { autoComplete: 'name' })}
        {field('email', '이메일', 'email', { autoComplete: 'email', placeholder: 'sugar@example.com' })}
        {field('password', '비밀번호 (8자 이상)', 'password', { autoComplete: 'new-password' })}
        {field('passwordCheck', '비밀번호 확인', 'password', { autoComplete: 'new-password' })}
        {field('phone', '휴대폰 번호', 'tel', { autoComplete: 'tel', placeholder: '010-0000-0000' })}

        <div className="terms">
          <label className="check all">
            <input id="join-agree" type="checkbox" checked={allAgreed} onChange={toggleAll} />
            전체 동의
          </label>
          {TERMS.map((t) => (
            <label key={t.key} className="check">
              <input
                type="checkbox"
                checked={agree[t.key]}
                onChange={(e) => {
                  setAgree((prev) => ({ ...prev, [t.key]: e.target.checked }))
                  setErrors((prev) => ({ ...prev, agree: undefined }))
                }}
              />
              {t.label}
            </label>
          ))}
        </div>
        {errors.agree && <p className="error">{errors.agree}</p>}

        <button type="submit" className="btn-primary">
          가입하기
        </button>
      </form>

      <div className="links">
        이미 회원이신가요? <Link to="/login">로그인</Link>
      </div>
      <p className="demo">※ 포트폴리오용 데모 가입이에요. 입력한 정보는 저장·전송되지 않아요.</p>
    </div>
  )
}

export default JoinPage
