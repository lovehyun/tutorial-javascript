let db;
const dbName = "todoDatabase";
const storeName = "tasks";

// IndexedDB 초기화
function initDB() {
    console.log("Opening database...");

    const request = indexedDB.open(dbName, 1);

    // 데이터베이스가 처음 생성되거나 버전이 업그레이드될 때 실행
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        console.log("Database created or upgraded.");
        const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("task", "task", { unique: false });
    };

    // 데이터베이스 연결에 성공했을 때 실행
    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Connected to the database successfully.");
        loadTasks(); // 페이지 로드 시 할일 목록 로드
        document.getElementById('todoInput').disabled = false; // 할 일 입력 가능하게 설정
        document.querySelector("button[onclick='addTask()']").disabled = false; // 버튼 활성화
    
        // 데이터베이스 버전 변경 시 연결을 닫도록 처리
        db.onversionchange = function() {
            db.close();
            alert("Database is outdated. Please reload the page.");
        };
    };

    // 데이터베이스 연결에 실패했을 때 실행
    request.onerror = function(event) {
        console.error("Database error: " + event.target.errorCode);
    };
}

// 새로운 할일 추가
function addTask() {
    if (!db) {
        console.error("Database is not initialized.");
        return;
    }

    const taskInput = document.getElementById('todoInput');
    const task = taskInput.value.trim();
    
    if (task) {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        objectStore.add({ task: task });

        transaction.oncomplete = function() {
            taskInput.value = ''; // 입력란 초기화
            loadTasks(); // 목록 갱신
        };

        transaction.onerror = function(event) {
            console.error("Transaction error: " + event.target.errorCode);
        };
    }
}

// 할일 목록 로드
function loadTasks() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = ''; // 기존 목록 초기화

    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);

    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const listItem = document.createElement('li');
            listItem.textContent = cursor.value.task;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() {
                deleteTask(cursor.primaryKey);
            };

            listItem.appendChild(deleteButton);
            todoList.appendChild(listItem);

            cursor.continue();
        }
    };
}

// 할일 삭제
function deleteTask(id) {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    objectStore.delete(id);

    transaction.oncomplete = function() {
        loadTasks(); // 삭제 후 목록 갱신
    };
}

// 데이터베이스 삭제
function deleteDatabase() {
    if (db) {
        // 열린 데이터베이스 연결 닫기
        db.close();
        console.log("Database connection closed.");
    }

    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onsuccess = function() {
        console.log("Database deleted successfully");
        document.getElementById('todoList').innerHTML = ''; // 목록 초기화
        alert("Database deleted successfully.");
    };

    deleteRequest.onerror = function(event) {
        console.error("Error deleting database: " + event.target.errorCode);
    };

    deleteRequest.onblocked = function() {
        alert("Database deletion blocked. Please close other tabs using the database and try again.");
        console.warn("Database deletion blocked");
    };
}

// 초기화 실행
initDB();
