import { useEffect, useMemo, useState } from 'react';

export default function FixedWithUseMemo() {
    const [keyword, setKeyword] = useState('');
    const [log, setLog] = useState([]);

    const items = ['apple', 'banana', 'orange', 'grape'];

    // ✅ keyword가 바뀔 때만 배열 재생성
    const filtered = useMemo(() => {
        return items.filter((item) => item.includes(keyword));
    }, [keyword]);

    useEffect(() => {
        setLog((prev) => [...prev, `검색 결과 개수: ${filtered.length}`]);
    }, [filtered]);

    return (
        <div style={{ padding: 20 }}>
            <h3>✅ useMemo로 버그 해결</h3>

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
