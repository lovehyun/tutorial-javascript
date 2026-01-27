const form = document.getElementById('search-form');
const queryInput = document.getElementById('query');
const resultsElement = document.getElementById('results');
const paginationElement = document.getElementById('pagination');

let currentQuery = '';
let currentPage = 1;

const display = 10; // 페이지당 개수
const MAX_BUTTONS = 10;

// 시작점 - 최초 로딩 시 URL 파라미터에 따라 다시 요청
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);

    const query = params.get('query');
    const page = parseInt(params.get('page') || '1', 10);

    if (query) {
        currentQuery = query;
        currentPage = page;
        queryInput.value = query; // 사용자 입력칸에도 재입력
        search();
    }
});

// 폼 제출 - 검색
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();
    if (!query) return;

    currentQuery = query;
    currentPage = 1;
    search();
});

// 주소창에 GET params 설정 - F5 대응
function updateURL() {
    const params = new URLSearchParams();
    params.set('query', currentQuery);
    params.set('page', currentPage);

    history.pushState(null, '', `?${params.toString()}`);
}

async function search() {
    updateURL();

    resultsElement.innerHTML = '<li>Loading...</li>';
    paginationElement.innerHTML = '';

    try {
        const response = await fetch(
            `/search/blog?query=${encodeURIComponent(currentQuery)}&page=${currentPage}&display=${display}`
        );
        const data = await response.json();

        renderResults(data.items || []);
        renderPagination(data.total || 0);
    } catch (error) {
        console.error(error);
        resultsElement.innerHTML = '<li>Error fetching results.</li>';
    }
}

function renderResults(items) {
    resultsElement.innerHTML = '';

    if (items.length === 0) {
        resultsElement.innerHTML = '<li>No results found.</li>';
        return;
    }

    items.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>
                <a href="${item.link}" target="_blank">
                    ${item.title}
                </a>
            </h3>
            <p>${item.description}</p>
            <small>Post Date: ${item.postdate}</small>
        `;
        resultsElement.appendChild(li);
    });
}

function renderPagination(total) {
    const totalPages = Math.min(
        Math.ceil(total / display),
        Math.floor(1000 / display) // 네이버 start 제한 고려
    );

    if (totalPages <= 1) return;

    paginationElement.innerHTML = '';

    const groupIndex = Math.floor((currentPage - 1) / MAX_BUTTONS);
    const startPage = groupIndex * MAX_BUTTONS + 1;
    const endPage = Math.min(startPage + MAX_BUTTONS - 1, totalPages);

    // 맨처음 <<
    paginationElement.appendChild(createButton('<<', 1, currentPage === 1));
    // prev <
    paginationElement.appendChild(createButton('<', currentPage - 1, currentPage === 1));

    for (let p = startPage; p <= endPage; p++) {
        paginationElement.appendChild(
            createButton(p, p, p === currentPage)
        );
    }

    // next >
    paginationElement.appendChild(
        createButton('>', currentPage + 1, currentPage === totalPages)
    );
    // 맨끝 >>
    paginationElement.appendChild(
        createButton('>>', totalPages, currentPage === totalPages)
    );
}

function createButton(label, page, disabled) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.disabled = disabled;

    if (page === currentPage && !isNaN(label)) {
        btn.style.fontWeight = 'bold';
        btn.style.textDecoration = 'underline';
    }

    btn.addEventListener('click', () => {
        currentPage = page;
        search();
    });

    return btn;
}
