import { useState } from 'react'
import data from '../data/products.json'
import './SearchBar.css'

const RECENT_KEY = 'recentSearch'
const MAX_RECENT = 5

// 상품 해시태그 중 많이 쓰인 6개를 인기 검색어로
const popularKeywords = (() => {
  const count = {}
  data.products.forEach((p) =>
    p.hashtags.forEach((tag) => {
      count[tag] = (count[tag] || 0) + 1
    }),
  )
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag.replace('#', ''))
})()

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || []
  } catch {
    return []
  }
}

function SearchBar({ keyword, onKeywordChange, onClose }) {
  const [recent, setRecent] = useState(loadRecent)

  const updateRecent = (list) => {
    setRecent(list)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list))
    } catch {
      // 저장 실패 시 화면 상태만 유지
    }
  }

  // 같은 검색어는 맨 앞으로, 최대 5개
  const addRecent = (word) => {
    const value = word.trim()
    if (!value) return
    updateRecent([value, ...recent.filter((item) => item !== value)].slice(0, MAX_RECENT))
  }

  const searchWord = (word) => {
    onKeywordChange(word)
    addRecent(word)
  }

  // Enter: 최근 검색어 저장 + 키보드 내리기
  const handleSubmit = (e) => {
    e.preventDefault()
    addRecent(keyword)
    e.currentTarget.querySelector('input').blur()
  }

  return (
    <div className="search-bar">
      <form className="field" role="search" onSubmit={handleSubmit}>
        <div className="input-wrap">
          <input
            type="search"
            placeholder="케이크 이름, 해시태그로 검색"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            autoFocus
          />
          {keyword && (
            <button type="button" className="clear" aria-label="입력 지우기" onClick={() => onKeywordChange('')}>
              ✕
            </button>
          )}
        </div>
        <button type="button" className="close" onClick={onClose}>
          닫기
        </button>
      </form>

      {!keyword.trim() && (
        <div className="suggest">
          <div className="group">
            <div className="group-head">
              <h3>최근 검색어</h3>
              {recent.length > 0 && (
                <button type="button" className="clear-all" onClick={() => updateRecent([])}>
                  전체 삭제
                </button>
              )}
            </div>
            {recent.length === 0 ? (
              <p className="none">최근 검색어가 없습니다.</p>
            ) : (
              <ul className="chips">
                {recent.map((word) => (
                  <li key={word}>
                    <button type="button" onClick={() => searchWord(word)}>
                      {word}
                    </button>
                    <button
                      type="button"
                      className="remove"
                      aria-label={`${word} 삭제`}
                      onClick={() => updateRecent(recent.filter((item) => item !== word))}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="group">
            <div className="group-head">
              <h3>인기 검색어</h3>
            </div>
            <ol className="popular">
              {popularKeywords.map((word, index) => (
                <li key={word}>
                  <button type="button" onClick={() => searchWord(word)}>
                    <em>{index + 1}</em>#{word}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
