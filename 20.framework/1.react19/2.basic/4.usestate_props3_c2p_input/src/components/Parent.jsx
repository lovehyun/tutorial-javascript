// Parent
//  └─ Child (state + onSubmit)

function Parent() {
    const handleSubmit = (value) => {
        console.log('자식에게 받은 값:', value);
    };

    return <Child onSubmit={handleSubmit} />;
}

export default Parent;


// 컴포넌트 캡슐화:
// - 특징
//   ✔ 자식이 자기 상태를 관리
//   ✔ 부모는 결과만 받음
//   ✔ 재사용성이 높음
// - 언제 쓰나?
//   ✔ 부모가 "결과"만 필요할 때
//   ✔ 입력/동작 로직이 컴포넌트 내부에 묶이는 게 자연스러울 때
//   ✔ 재사용 가능한 UI 컴포넌트일 때
// - 예시 상황
//   ✔ 검색 입력 박스
//   ✔ 모달 내부 폼
//   ✔ 댓글 입력창
//   ✔ date picker, file uploader
// - 장점
//   ✔ 부모 코드가 깔끔
//   ✔ 컴포넌트 재사용 쉬움
//   ✔ 내부 구현을 감출 수 있음
// - 단점
//   ✔ 부모가 중간 상태를 모름
//   ✔ 외부에서 제어하기 어려움
//   ✔ 상태 동기화가 필요해질 수 있음

// 참고: 로그인폼/게시글 작성은 "입력 UI"가 아니라
// "업무 데이터(business data)" 이고, 검색창·date picker는 "UI 도구(UI widget)"

// | 개념                   | 설명                  |
// | ---------------------- | --------------------- |
// | Lifting State Up       | state를 부모로 올리는 것 |
// | Controlled Component   | 부모가 value를 제어    |
// | Uncontrolled Component | 내부에서 state 관리    |
// | Single Source of Truth | 한 곳에서만 상태 관리   |

