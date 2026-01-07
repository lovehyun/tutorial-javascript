import { useEffect, useState } from 'react';

export default function App() {
    const [keyword, setKeyword] = useState('');
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (!keyword) {
            setResult([]);
            return;
        }

        const timer = setTimeout(() => {
            console.log('검색 실행:', keyword);

            // 실제로는 fetch / axios
            setResult([`"${keyword}" 검색 결과`]);
        }, 500);

        // 핵심: 타이핑 중이면 이전 요청 취소
        // useEffect의 return은 "다음 effect가 실행되기 직전에, 이전 effect를 정리(cleanup)하는 함수"입니다.
        return () => clearTimeout(timer);
        // const cleanup = () => clearTimeout(timer);
        // return cleanup;
        
    }, [keyword]);

    return (
        <div>
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어 입력"
            />

            <ul>
                {result.map((r, i) => (
                    <li key={i}>{r}</li>
                ))}
            </ul>
        </div>
    );
}
