const form = document.getElementById('search-form');
const queryInput = document.getElementById('query');
const resultsElement = document.getElementById('results');
const paginationElement = document.getElementById('pagination');

let currentQuery = '';
let currentPage = 1;

const display = 10; // 페이지당 개수
const MAX_BUTTONS = 10;

// 시작점 (폼 제출)
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();
    if (!query) return;

    currentQuery = query;
    currentPage = 1;
    search();
});

// 검색 (fetch)
async function search() {
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

// 결과 출력
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

// 페이지 출력
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
