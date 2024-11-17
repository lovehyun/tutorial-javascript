const API_URL = '/api/stores';

async function fetchStores(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const { items, totalItems, currentPage, totalPages } = await response.json();

        renderTable(items);
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
}

function renderTable(stores) {
    const tableContainer = document.getElementById('stores-table');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
                ${stores.map(store => `
                    <tr>
                        <td>${store.Id}</td>
                        <td>${store.Type}</td>
                        <td>${store.Name}</td>
                        <td>${store.Address}</td>
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
        button.addEventListener('click', () => fetchStores(page));
        paginationContainer.appendChild(button);
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => fetchStores());
