const API_URL = '/api/orders';

async function fetchOrders(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const { items, totalItems, currentPage, totalPages } = await response.json();

        renderTable(items);
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function renderTable(orders) {
    const tableContainer = document.getElementById('orders-table');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Ordered At</th>
                    <th>Store ID</th>
                    <th>User ID</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>${order.Id}</td>
                        <td>${order.OrderAt}</td>
                        <td>${order.StoreId}</td>
                        <td>${order.UserId}</td>
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
        button.addEventListener('click', () => fetchOrders(page));
        paginationContainer.appendChild(button);
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => fetchOrders());
