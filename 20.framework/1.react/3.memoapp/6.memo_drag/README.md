# 드래그 앤 드롭으로 메모 순서 변경 기능 구현
React에서 드래그 앤 드롭(DnD) 기능을 구현하려면 react-beautiful-dnd 라이브러리를 사용하는 것이 간편합니다. 이 라이브러리를 사용하면 메모를 쉽게 드래그 앤 드롭하여 순서를 변경할 수 있습니다.

1. 필요한 라이브러리 설치
react-beautiful-dnd 설치:

```bash
npm install react-beautiful-dnd
```

# 주요 변경 사항
1. react-beautiful-dnd 사용:
  - DragDropContext: 드래그 앤 드롭 컨텍스트를 정의.
  - Droppable: 드롭 가능한 영역을 정의.
  - Draggable: 드래그 가능한 항목을 정의.
2. 순서 변경 로직:
  - onReorderMemos 함수로 드래그 앤 드롭된 항목의 순서를 업데이트.
3. 드래그 피드백 스타일링:
  - 드래그된 항목에 시각적 피드백을 추가(박스 그림자, 배경색 변경).

# 동작
  - 메모를 드래그하여 원하는 위치로 이동할 수 있습니다.
  - 이동된 순서는 state로 저장되며, 앱 내에서 유지됩니다.


# 주의사항
index.js 에서 Strict 모드를 사용할 경우 react-beautiful-dnd 와 충돌나기 때문에 Strict 모드를 제거해야 함.
