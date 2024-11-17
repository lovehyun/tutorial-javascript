const API_URL = '/api/items';

async function fetchItems(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const { items, totalItems, currentPage, totalPages } = await response.json();

        renderTable(items);
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function renderTable(items) {
    const tableContainer = document.getElementById('items-table');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Unit Price</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.Id}</td>
                        <td>${item.Type}</td>
                        <td>${item.Name}</td>
                        <td>${item.UnitPrice}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.textContent = page;
        button.disabled = page === currentPage;
        button.addEventListener('click', () => fetchItems(page));
        paginationContainer.appendChild(button);
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => fetchItems());
