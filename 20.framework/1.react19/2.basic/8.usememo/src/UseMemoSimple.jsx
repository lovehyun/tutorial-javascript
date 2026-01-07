// useMemo의 역할
// useMemo(() => 계산, [keyword]);

// useMemo는 "렌더링을 막는 게 아니라 계산을 다시 하지 않게 하는 것"
// 컴포넌트는 계속 리렌더링 됨. 계산 결과만 캐싱.

import { useMemo, useState } from 'react';

export default function UseMemoSimple() {
    const [a, setA] = useState(1);
    const [b, setB] = useState(2);
    const [count, setCount] = useState(0);

    // 어떤 버튼이 클릭되건 항상 재 계산됨
    // console.log('sum 계산됨: ', sum);
    // const sum = a + b;

    // a 또는 b가 바뀔 때만 다시 계산됨
    const sum = useMemo(() => {
        const sum = a + b;
        console.log('sum 계산됨: ', sum);
        return sum;
    }, [a, b]);

    return (
        <div style={{ padding: 20 }}>
            <h3>useMemo 가장 간단한 예제</h3>

            <div>
                <button onClick={() => setA(a + 1)}>a 증가</button>
                <button onClick={() => setB(b + 1)}>b 증가</button>
            </div>

            <p>
                a = {a}, b = {b}
            </p>
            <p>합계(sum): {sum}</p>

            <hr />

            {/* a, b 와 전혀 상관없는 state */}
            <button onClick={() => setCount(count + 1)}>
                다른 state 변경 (count: {count})
            </button>
        </div>
    );
}


// a 또는 b 버튼 클릭 → 로그 찍힘
// count 버튼 클릭 → 로그 안 찍힘
// useMemo 덕분에 "관계없는 렌더링에서는 계산을 재사용" 합니다.
