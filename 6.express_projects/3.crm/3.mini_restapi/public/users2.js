const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-name');

let searchName = '';
let currentPage = 1;

// 검색 버튼 클릭 이벤트
searchButton.addEventListener('click', () => {
    searchName = searchInput.value;
    fetchUsers(1); // 검색 시 항상 첫 페이지를 로드
});

// 검색창에서 Enter 키 이벤트
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchName = searchInput.value;
        fetchUsers(1);
    }
});

// 사용자 데이터를 API에서 가져오는 함수
function fetchUsers(page) {
    currentPage = page; // 현재 페이지 업데이트
    const queryString = `?page=${page}&name=${encodeURIComponent(searchName)}`;

    // URL 상태 업데이트 (브라우저 히스토리)
    // window.history.pushState({}, '', queryString);

    fetch(`/api/users${queryString}`)
        .then(response => response.json())
        .then(data => {
            renderTable(data.data);
            renderPagination(data.totalPages, currentPage);
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
        // 테이블 헤더 생성
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

        // 테이블 데이터 생성
        data.forEach(row => {
            const rowElement = document.createElement('tr');

            rowElement.addEventListener('click', () => {
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

// Pagination 렌더링
function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');

    pagination.innerHTML = '';

    // Previous 출력
    if (currentPage > 1) {
        const prev = document.createElement('a');
        prev.textContent = '« Previous';
        prev.href = '#';
        prev.addEventListener('click', (e) => {
            e.preventDefault();
            fetchUsers(currentPage - 1);
        });
        pagination.appendChild(prev);
    }

    // 모든 페이지 번호 생성
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.href = '#';
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetchUsers(i);
        });
        pagination.appendChild(pageLink);
    }

    // Next 출력
    if (currentPage < totalPages) {
        const next = document.createElement('a');
        next.textContent = 'Next »';
        next.href = '#';
        next.addEventListener('click', (e) => {
            e.preventDefault();
            fetchUsers(currentPage + 1);
        });
        pagination.appendChild(next);
    }
}

// URL에서 페이지 번호와 검색어 파싱
function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    const name = urlParams.get('name') || '';
    searchInput.value = name;
    searchName = name;
    return { page, name };
}

// 초기 데이터 로드
const { page } = parseURLParams();
fetchUsers(page);
