// 검색창, 필터, 정렬
function Filters({ filters, options, counts, onChange, onReset }) {
  const select = (key, label, values) => (
    <select value={filters[key]} onChange={(e) => onChange({ [key]: e.target.value })} aria-label={label}>
      <option value="">{label}: 전체</option>
      {values.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  )

  return (
    <section className="filters">
      <input
        type="search"
        placeholder="게임 이름 검색 (한글·영문)"
        value={filters.query}
        onChange={(e) => onChange({ query: e.target.value })}
      />
      <div className="filter-row">
        <select value={filters.view} onChange={(e) => onChange({ view: e.target.value })} aria-label="보기">
          <option value="">보기: 전체</option>
          <option value="favorites">♥ 찜한 게임 ({counts.favorites})</option>
          <option value="hidden">숨긴 게임 ({counts.hidden})</option>
        </select>
        {select('status', '진행 상태', options.statuses)}
        {select('korean', '한글화', options.koreans)}
        {select('genre', '장르', options.genres)}
        <select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} aria-label="정렬">
          <option value="title">이름순</option>
          <option value="metacritic">메타크리틱 높은 순</option>
        </select>
        <label className="check">
          <input
            type="checkbox"
            checked={filters.controller}
            onChange={(e) => onChange({ controller: e.target.checked })}
          />
          컨트롤러 지원만
        </label>
        <button type="button" className="link" onClick={onReset}>
          초기화
        </button>
      </div>
    </section>
  )
}

export default Filters
