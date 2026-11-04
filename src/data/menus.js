// filter: 누르면 해당 상품만 보기 / scroll: 누르면 해당 영역으로 이동
export const mainMenus = [
  { label: '전체상품', icon: 'All', type: 'all', filter: 'all' },
  { label: '이벤트', icon: '🎁', type: 'event', scroll: 'review-event' },
  { label: '타임딜', icon: '특가', type: 'time', scroll: 'weekend-deal' },
  { label: '신상품', icon: 'NEW', type: 'new', filter: 'new' },
  { label: '핫딜', icon: '핫딜', type: 'hot', filter: 'hot' },
]

export const categoryMenus = [
  { label: '생일', icon: 'birthday', filter: 'birthday' },
  { label: '기념일', icon: 'anniversary', filter: 'anniversary' },
  { label: '포토', icon: 'photo', filter: 'photo' },
  { label: '감사', icon: 'thanks', filter: 'thanks' },
  { label: '축하', icon: 'celebration', filter: 'celebration' },
  { label: '팬·아이돌', icon: 'fan', filter: 'fan' },
  { label: '토퍼', icon: 'topper', filter: 'topper' },
  { label: '전체 케이크', icon: 'all', filter: 'cake' },
]
