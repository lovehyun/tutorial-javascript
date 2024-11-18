// 할일 추가
function addTask() {
    const taskInput = document.getElementById('todoInput');
    const task = taskInput.value.trim();

    if (task) {
        const todoList = document.getElementById('todoList');

        // 새로운 리스트 항목 생성
        const listItem = document.createElement('li');
        listItem.textContent = task;

        // 삭제 버튼 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            todoList.removeChild(listItem);
        };

        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);

        // 입력란 초기화
        taskInput.value = '';
    }
}
