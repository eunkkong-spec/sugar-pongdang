import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../utils/products.js'
import { orderNotices } from '../data/notice.js'
import data from '../data/products.json'
import './OrderPage.css'

const { common, categories } = data
const sizes = common.cake.options.size.map((size) => size.name)
const figureOptions = ['없음', '1명', '2명', '3명', '4명', '5명 이상']
const MAX_PHOTOS = 5
const MAX_LETTERING = 30

// 오늘부터 n일 뒤 날짜 (YYYY-MM-DD)
function daysLater(n) {
  const date = new Date()
  date.setDate(date.getDate() + n)
  const pad = (v) => String(v).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const MIN_DATE = daysLater(14)
const RECOMMEND_DATE = daysLater(21)

// 필수 항목 확인 (틀린 칸: 안내 문구)
function validate(form) {
  const errors = {}
  if (!form.purpose) errors.purpose = '케이크 용도를 골라 주세요.'
  if (!form.request.trim()) errors.request = '원하시는 디자인을 적어 주세요.'
  if (!form.date) errors.date = '수령 희망일을 골라 주세요.'
  else if (form.date < MIN_DATE) errors.date = '제작 기간이 필요해서 오늘부터 14일 이후만 선택할 수 있어요.'
  if (!form.delivery) errors.delivery = '수령 방법을 골라 주세요.'
  if (!form.name.trim()) errors.name = '이름을 적어 주세요.'
  if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone.trim())) errors.phone = '연락처를 010-0000-0000 형식으로 적어 주세요.'
  if (!form.agree) errors.agree = '개인정보 수집에 동의해 주세요.'
  return errors
}

function OrderPage() {
  const [params] = useSearchParams()
  const initialProduct = products.find((p) => p.id === Number(params.get('product')))

  const [product, setProduct] = useState(initialProduct)
  const [form, setForm] = useState({
    purpose: initialProduct?.category || '',
    size: sizes[0],
    figures: figureOptions[0],
    lettering: '',
    request: '',
    date: '',
    delivery: '',
    name: '',
    phone: '',
    kakao: '',
    agree: false,
  })
  const [photos, setPhotos] = useState([])
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const photosRef = useRef(photos)

  // 페이지를 떠나면 미리보기 주소 정리
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), [])

  const isTopper = form.purpose === 'topper'
  const deliveryOptions = isTopper ? common.topper.delivery.method : common.cake.delivery.method

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // 용도가 바뀌면 수령 방법이 달라질 수 있어서 다시 고르게
  const changePurpose = (value) => {
    setForm((prev) => ({ ...prev, purpose: value, delivery: '' }))
    setErrors((prev) => ({ ...prev, purpose: undefined }))
  }

  const addPhotos = (e) => {
    const files = [...e.target.files].slice(0, MAX_PHOTOS - photos.length)
    setPhotos((prev) => [...prev, ...files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))])
    e.target.value = ''
  }

  const removePhoto = (url) => {
    URL.revokeObjectURL(url)
    setPhotos((prev) => prev.filter((photo) => photo.url !== url))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = validate(form)
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      const field = document.getElementById(`order-${first}`)
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      field?.focus({ preventScroll: true })
      return
    }
    setDone(true)
    window.scrollTo(0, 0)
  }

  // 칸 아래 빨간 안내
  const errorText = (key) =>
    errors[key] && (
      <p className="error" id={`order-${key}-error`}>
        {errors[key]}
      </p>
    )
  const fieldProps = (key) => ({
    id: `order-${key}`,
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `order-${key}-error` : undefined,
  })

  const purposeName = categories.find((c) => c.key === form.purpose)?.name

  if (done) {
    return (
      <div className="section order-page">
        <div className="done">
          <p className="emoji">🎂</p>
          <h2>주문제작 신청서가 작성되었어요</h2>
          <p>카카오톡 상담에서 디자인과 금액을 확인한 뒤 주문이 확정됩니다.</p>

          <dl>
            <dt>참고 디자인</dt>
            <dd>{product ? product.title : '새로운 디자인'}</dd>
            <dt>용도</dt>
            <dd>{purposeName}</dd>
            {!isTopper && (
              <>
                <dt>크기</dt>
                <dd>{form.size}</dd>
              </>
            )}
            <dt>피규어</dt>
            <dd>{form.figures}</dd>
            <dt>레터링</dt>
            <dd>{form.lettering || '없음'}</dd>
            <dt>참고 사진</dt>
            <dd>{photos.length}장</dd>
            <dt>수령</dt>
            <dd>
              {form.date} · {form.delivery}
            </dd>
            <dt>주문자</dt>
            <dd>
              {form.name} · {form.phone}
            </dd>
          </dl>

          <button type="button" className="btn-kakao" onClick={() => alert('카카오톡 채널 연결은 준비 중입니다.')}>
            카카오톡으로 상담 이어가기
          </button>
          <Link to="/" className="btn-home">
            메인으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className="section order-page" onSubmit={submit} noValidate>
      <h2 className="page-title">주문제작 신청서</h2>
      <p className="lead">세상에 하나뿐인 케이크, 원하시는 내용을 알려 주세요.</p>

      <ul className="notice">
        {orderNotices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>

      <fieldset>
        <legend>참고 디자인</legend>
        {product ? (
          <div className="ref">
            <img src={product.image} alt="" />
            <div>
              <p>{product.title}</p>
              <button type="button" onClick={() => setProduct(null)}>
                선택 해제 (새로운 디자인으로)
              </button>
            </div>
          </div>
        ) : (
          <p className="ref-none">
            새로운 디자인으로 신청해요. 참고 사진을 첨부해 주시면 좋아요. <Link to="/products">디자인 둘러보기 ›</Link>
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend>케이크 정보</legend>

        <label htmlFor="order-purpose">
          용도 <em>*</em>
        </label>
        <select {...fieldProps('purpose')} value={form.purpose} onChange={(e) => changePurpose(e.target.value)}>
          <option value="">선택해 주세요</option>
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.name}
            </option>
          ))}
        </select>
        {errorText('purpose')}

        {!isTopper && (
          <>
            <p className="label">크기</p>
            <div className="choices">
              {sizes.map((size) => (
                <button key={size} type="button" aria-pressed={form.size === size} onClick={() => update('size', size)}>
                  {size}
                </button>
              ))}
            </div>
          </>
        )}

        <label htmlFor="order-figures">피규어 인원</label>
        <select id="order-figures" value={form.figures} onChange={(e) => update('figures', e.target.value)}>
          {figureOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <label htmlFor="order-lettering">레터링 문구</label>
        <input
          id="order-lettering"
          type="text"
          maxLength={MAX_LETTERING}
          placeholder="예) 지민언니 생일 축하해 ♥"
          value={form.lettering}
          onChange={(e) => update('lettering', e.target.value)}
        />
        <p className="count">
          {form.lettering.length}/{MAX_LETTERING}
        </p>

        <label htmlFor="order-request">
          디자인 요청사항 <em>*</em>
        </label>
        <textarea
          {...fieldProps('request')}
          rows={5}
          placeholder="피규어 외모(헤어·옷·소품), 원하는 색감, 꼭 넣고 싶은 요소를 자유롭게 적어 주세요."
          value={form.request}
          onChange={(e) => update('request', e.target.value)}
        />
        {errorText('request')}

        <p className="label">
          참고 사진 <small>(최대 {MAX_PHOTOS}장)</small>
        </p>
        <ul className="photos">
          {photos.map((photo) => (
            <li key={photo.url}>
              <img src={photo.url} alt={photo.name} />
              <button type="button" aria-label={`${photo.name} 삭제`} onClick={() => removePhoto(photo.url)}>
                ✕
              </button>
            </li>
          ))}
          {photos.length < MAX_PHOTOS && (
            <li>
              <label className="add-photo">
                <input type="file" accept="image/*" multiple onChange={addPhotos} />
                ＋<span>사진 추가</span>
              </label>
            </li>
          )}
        </ul>
      </fieldset>

      <fieldset>
        <legend>수령 정보</legend>

        <label htmlFor="order-date">
          수령 희망일 <em>*</em>
        </label>
        <input {...fieldProps('date')} type="date" min={MIN_DATE} value={form.date} onChange={(e) => update('date', e.target.value)} />
        {errorText('date')}
        {form.date && form.date >= MIN_DATE && form.date < RECOMMEND_DATE && (
          <p className="hint">2-3주 전 주문을 권장해요. 일정이 촉박하면 카카오톡으로 먼저 상담해 주세요.</p>
        )}

        <p className="label" id="order-delivery-label">
          수령 방법 <em>*</em>
        </p>
        <div className="choices" role="group" aria-labelledby="order-delivery-label" {...fieldProps('delivery')} tabIndex={-1}>
          {deliveryOptions.map((method) => (
            <button key={method} type="button" aria-pressed={form.delivery === method} onClick={() => update('delivery', method)}>
              {method}
            </button>
          ))}
        </div>
        {errorText('delivery')}
      </fieldset>

      <fieldset>
        <legend>주문자 정보</legend>

        <label htmlFor="order-name">
          이름 <em>*</em>
        </label>
        <input {...fieldProps('name')} type="text" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} />
        {errorText('name')}

        <label htmlFor="order-phone">
          연락처 <em>*</em>
        </label>
        <input
          {...fieldProps('phone')}
          type="tel"
          autoComplete="tel"
          placeholder="010-0000-0000"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
        />
        {errorText('phone')}

        <label htmlFor="order-kakao">카카오톡 ID (선택)</label>
        <input id="order-kakao" type="text" value={form.kakao} onChange={(e) => update('kakao', e.target.value)} />
      </fieldset>

      <label className="agree">
        <input {...fieldProps('agree')} type="checkbox" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} />
        <span>
          [필수] 상담·제작을 위한 개인정보(이름, 연락처, 카카오톡 ID) 수집·이용에 동의합니다.
        </span>
      </label>
      {errorText('agree')}

      <button type="submit" className="btn-submit">
        주문제작 신청하기
      </button>
    </form>
  )
}

export default OrderPage
