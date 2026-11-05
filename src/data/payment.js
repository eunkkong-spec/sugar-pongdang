// 토스페이먼츠 결제창 클라이언트 키 (API 개별 연동 키, 화면에 공개돼도 되는 키)
// 테스트 키(test_ck_…)라 실제로 결제되지 않음. 시크릿 키(…_sk_…)는 절대 넣지 말 것
export const TOSS_CLIENT_KEY = 'test_ck_c19wpihnCfKvu5cCbq0VOqRvvhcJ7Ee3jN'

// 결제창으로 넘어가기 전 주문 내용을 잠깐 보관하는 이름 (결제 후 돌아와서 확인)
export const PENDING_ORDER_KEY = 'pendingOrder'
