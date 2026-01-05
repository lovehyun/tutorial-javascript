const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-name');

let searchName = '';

// 검색 버튼 클릭 이벤트
searchButton.addEventListener('click', () => {
    searchName = searchInput.value;
    fetchUsers();
});

// 검색창에서 Enter 키 이벤트
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchName = searchInput.value;
        fetchUsers();
    }
});

// 사용자 데이터를 API에서 가져오는 함수
function fetchUsers() {
    const queryString = `?name=${encodeURIComponent(searchName)}`;

    fetch(`/api/users${queryString}`)
        .then(response => response.json())
        .then(data => {
            renderTable(data.data);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

// 테이블 렌더링
function renderTable(data) {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        // 테이블 헤더 생성 - 첫번째 객체의 key
        const fields = Object.keys(data[0]);
        
        const headerRow = document.createElement('tr');
        fields.forEach(field => {
            if (field !== 'Id' && field !== 'Address') {
                const th = document.createElement('th');
                th.textContent = field;
                headerRow.appendChild(th);
            }
        });
        tableHeader.appendChild(headerRow);

        // 테이블 데이터 생성 - [] 의 value들
        data.forEach(row => {
            const rowElement = document.createElement('tr');
            
            rowElement.addEventListener('click', () => {  // row 에 클릭으로 이동 추가
                window.location = `/user/${row.Id}`;
            });
            
            for (const [key, value] of Object.entries(row)) {
                if (key !== 'Id' && key !== 'Address') {
                    const td = document.createElement('td');
                    td.textContent = value;
                    rowElement.appendChild(td);
                }
            }
            tableBody.appendChild(rowElement);
        });
    }
}

// 초기 데이터 로드
fetchUsers();
