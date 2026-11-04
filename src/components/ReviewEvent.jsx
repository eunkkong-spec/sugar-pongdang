import './ReviewEvent.css'

function ReviewEvent() {
  return (
    <section className="review-event" id="review-event">
      <div className="text">
        <h2>
          리뷰를 부탁해
          <strong>포토후기 이벤트!</strong>
        </h2>
        <p>포토후기를 작성하신 고객님 중 10명을 추첨을 통하여 선물을 드립니다.</p>
      </div>
      <img src="images/cakes/cake_20.jpg" alt="포토후기 이벤트 케이크" />
      <span className="camera">📷</span>
    </section>
  )
}

export default ReviewEvent
