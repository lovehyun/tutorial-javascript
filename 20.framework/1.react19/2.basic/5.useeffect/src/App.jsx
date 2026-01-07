// 그래서 useEffect는 "언제 실행되나?"
// 렌더링이 끝난 "뒤"에 실행됩니다
// 렌더링 계산 → 화면 반영 → useEffect 실행
// 
// useEffect(() => {
//     // 부수 효과(side effect)
// }, [의존성]);
// 
// useEffect(() => {
//   // effect 실행
// 
//   return () => {
//     // cleanup
//   };
// }, [deps]);


import { useEffect, useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('count 변경:', count);
    }, [count]);

    return (
        <>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </>
    );
}


// function Example() {
//     console.log("1. render 시작");
// 
//     useEffect(() => {
//         console.log("3. effect 실행");
//     }, []);
// 
//     console.log("2. return 직전");
// 
//     return <div>Hello</div>;
// }
// 
// 1. render 시작
// 2. return 직전
// (화면이 그려짐)
// 3. effect 실행
