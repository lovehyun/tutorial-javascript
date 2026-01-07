import { useEffect, useState } from 'react';

export default function BugWithoutUseMemo() {
    const [keyword, setKeyword] = useState('');
    const [log, setLog] = useState([]);

    const items = ['apple', 'banana', 'orange', 'grape'];

    // ❌ 매 렌더링마다 "새 배열" 생성
    const filtered = items.filter((item) => item.includes(keyword));

    // ❌ filtered가 매번 "다른 객체"로 인식됨
    useEffect(() => {
        setLog((prev) => [...prev, `검색 결과 개수: ${filtered.length}`]);
    }, [filtered]); // 👈 문제의 핵심

    return (
        <div style={{ padding: 20 }}>
            <h3>❌ useMemo 없이 생기는 버그</h3>

            <input placeholder="검색어 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />

            <ul>
                {filtered.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>

            <pre>{log.join('\n')}</pre>
        </div>
    );
}
