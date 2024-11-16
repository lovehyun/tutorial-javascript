# 변경 사항
1. 체크박스 크기 조정:
  - 체크박스의 크기를 .checkbox 클래스에서 width: 20px;과 height: 20px;으로 조정.
  - cursor: pointer;를 추가해 클릭 가능 영역을 강조.
2. 수정 제한:
  - input 필드에 disabled={memo.completed} 속성을 추가하여 완료된 메모는 수정 불가능.
3. 완료된 메모 스타일링:
  - 완료된 메모는 회색 텍스트(color: gray)와 줄 긋기(text-decoration: line-through) 스타일을 유지.
