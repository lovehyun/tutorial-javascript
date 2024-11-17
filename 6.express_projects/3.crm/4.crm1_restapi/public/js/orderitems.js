const API_URL = '/api/orderitems';

async function fetchOrderItems(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const { items, totalItems, currentPage, totalPages } = await response.json();

        renderTable(items);
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error('Error fetching order items:', error);
    }
}

function renderTable(orderItems) {
    const tableContainer = document.getElementById('orderitems-table');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Order ID</th>
                    <th>Item ID</th>
                </tr>
            </thead>
            <tbody>
                ${orderItems.map(orderItem => `
                    <tr>
                        <td>${orderItem.Id}</td>
                        <td>${orderItem.OrderId}</td>
                        <td>${orderItem.ItemId}</td>
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
        button.addEventListener('click', () => fetchOrderItems(page));
        paginationContainer.appendChild(button);
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => fetchOrderItems());
