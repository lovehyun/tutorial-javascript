// Parent (state)
//  └─ Child (props: value, onChange)

import { useState } from 'react';
import Child from './Child';

function Parent() {
    const [message, setMessage] = useState('');

    // 👉 자식이 호출할 함수
    const handleMessage = (data) => {
        setMessage(data);
    };

    return (
        <div>
            <h2>부모</h2>
            <p>자식에게서 받은 값: {message}</p>

            <Child sendMessageToParent={handleMessage} />
        </div>
    );
}

export default Parent;


// 부모가 state 소유 — 정석
// - 특징
//   ✔ 부모가 상태를 완전히 통제
//   ✔ 자식은 "UI 컴포넌트" 역할
//   ✔ 상태 흐름이 명확함
// - 언제 쓰나?
//   ✔ 부모가 이 값을 다른 곳에서도 사용할 때
//   ✔ 여러 자식이 같은 상태를 공유할 때
//   ✔ 검증, 초기화, 리셋, 저장 등을 부모가 제어해야 할 때
// - 예시 상황
//   ✔ 로그인 폼
//   ✔ 게시글 작성 폼
//   ✔ 검색어를 리스트/페이지네이션에 같이 쓰는 경우
// - 장점
//   ✔ 데이터 흐름이 단순
//   ✔ 디버깅 쉬움
//   ✔ 예측 가능
//   ✔ React 철학에 가장 잘 맞음
// - 단점
//   ✔ props가 많아질 수 있음
//   ✔ 단순 컴포넌트에도 코드가 길어짐
