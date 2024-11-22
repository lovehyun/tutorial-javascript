document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 15;

    fetch('/logs', {
        method: 'GET',
        headers: {
            'x-auth': localStorage.getItem('token'),
        },
    })
    .then(response => {
        if (!response.ok) {
            return window.handleError(response);
        }
        return response.json();
    })
    .then(logs => {
        const logsContainer = document.getElementById('logsContainer');

        // API 키 별로 그룹화
        const logsByApiKey = logs.reduce((acc, log) => {
            acc[log.apiKey] = acc[log.apiKey] || [];
            acc[log.apiKey].push(log);
            return acc;
        }, {});

        // API 키 별로 아코디언 생성
        Object.keys(logsByApiKey).forEach((apiKey, index) => {
            const logsForApiKey = logsByApiKey[apiKey];
            const totalPages = Math.ceil(logsForApiKey.length / itemsPerPage);

            // 아코디언 아이템 생성
            const accordionItem = document.createElement('div');
            accordionItem.className = 'card';

            const accordionHeader = document.createElement('div');
            accordionHeader.className = 'card-header';
            accordionHeader.id = `heading-${index}`;
            accordionHeader.innerHTML = `
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
                        Logs for API Key: ${apiKey}
                    </button>
                </h2>
            `;
            accordionItem.appendChild(accordionHeader);

            const accordionBody = document.createElement('div');
            accordionBody.id = `collapse-${index}`;
            accordionBody.className = 'collapse';
            accordionBody.setAttribute('aria-labelledby', `heading-${index}`);
            accordionBody.setAttribute('data-parent', '#logsContainer');

            const accordionBodyContent = document.createElement('div');
            accordionBodyContent.className = 'card-body';

            // 테이블 및 페이지네이션 컨테이너 추가
            const tableContainer = document.createElement('div');
            tableContainer.id = `table-container-${index}`;
            accordionBodyContent.appendChild(tableContainer);

            const paginationContainer = document.createElement('nav');
            paginationContainer.id = `pagination-${index}`;
            paginationContainer.className = 'pagination justify-content-center mt-4';
            accordionBodyContent.appendChild(paginationContainer);

            accordionBody.appendChild(accordionBodyContent);
            accordionItem.appendChild(accordionBody);
            logsContainer.appendChild(accordionItem);

            // 초기 페이지 렌더링
            renderTable(logsForApiKey, 1, index, itemsPerPage);
            renderPagination(totalPages, index, page => {
                renderTable(logsForApiKey, page, index, itemsPerPage);
            });
        });
    })
    .catch(error => console.error('Error fetching logs:', error));

    // 페이지네이션 버튼을 렌더링하는 함수
    function renderPagination(totalPages, accordionIndex, onPageChange) {
        const pagination = document.getElementById(`pagination-${accordionIndex}`);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === 1 ? 'active' : ''}`;
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.textContent = i;
            pageLink.href = '#';
            pageLink.addEventListener('click', (event) => {
                event.preventDefault();
                document.querySelectorAll(`#pagination-${accordionIndex} .page-item`).forEach(item => item.classList.remove('active'));
                pageItem.classList.add('active');
                onPageChange(i);
            });

            pageItem.appendChild(pageLink);
            pagination.appendChild(pageItem);
        }
    }

    // 테이블을 렌더링하는 함수
    function renderTable(logs, page, accordionIndex, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const logsForPage = logs.slice(start, end);

        const tableContainer = document.getElementById(`table-container-${accordionIndex}`);
        tableContainer.innerHTML = '';

        if (logsForPage.length === 0) {
            tableContainer.innerHTML = '<p>No logs available for this page.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'table table-striped';
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Timestamp</th>
                <th>Message</th>
                <th>Reply</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        logsForPage.forEach(log => {
            const row = document.createElement('tr');
            const timestampCell = document.createElement('td');
            const messageCell = document.createElement('td');
            const replyCell = document.createElement('td');

            timestampCell.textContent = new Date(log.timestamp).toLocaleString();
            messageCell.textContent = log.message;
            replyCell.textContent = log.reply;

            row.appendChild(timestampCell);
            row.appendChild(messageCell);
            row.appendChild(replyCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }
});
