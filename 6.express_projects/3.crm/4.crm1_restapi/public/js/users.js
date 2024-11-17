const API_URL = '/api/users';

async function fetchUsers(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}`);
        const { items, totalItems, currentPage, totalPages } = await response.json();

        renderTable(items);
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function renderTable(users) {
    const tableContainer = document.getElementById('users-table');
    tableContainer.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Birthdate</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.Id}</td>
                        <td>${user.Name}</td>
                        <td>${user.Gender}</td>
                        <td>${user.Age}</td>
                        <td>${user.Birthdate}</td>
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
        button.addEventListener('click', () => fetchUsers(page));
        paginationContainer.appendChild(button);
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => fetchUsers());
