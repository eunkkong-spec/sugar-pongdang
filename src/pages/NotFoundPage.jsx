import { Link } from 'react-router-dom'

// 없는 주소로 들어왔을 때
function NotFoundPage() {
  return (
    <div className="section not-found">
      <h2 className="section-title">페이지를 찾을 수 없어요</h2>
      <p>주소를 다시 확인해 주세요.</p>
      <Link to="/">메인으로 가기 ›</Link>
    </div>
  )
}

export default NotFoundPage
