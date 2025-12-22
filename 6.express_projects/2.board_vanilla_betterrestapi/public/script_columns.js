document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/boards')
        .then((res) => res.json())
        .then((json) => {
            if (!json.success) {
                alert(json.error || '목록 조회 실패');
                return;
            }
            const list = document.getElementById('card-list');
            list.innerHTML = '';
            json.data.forEach((post) => {
                makeCard(post.id, post.title, post.message);
            });
        })
        .catch((err) => {
            console.error(err);
            alert('서버 통신 오류(목록)');
        });
});

function makeCard(id, title, message) {
    const wrapper = document.createElement('div');
    // wrapper.className = 'col-12 col-md-6 col-lg-4 mb-3';
    wrapper.className = 'col-12 col-md-4 col-lg-4 mb-3';
    wrapper.innerHTML = `
        <div class="card" id="card_${id}">
            <div class="card-body">
                <p class="card-id">${id}</p>
                <p class="card-title">${title}</p>
                <p class="card-text">${message}</p>
                <button class="btn btn-info" onclick="modifyPost(${id})">수정</button>
                <button class="btn btn-warning" onclick="deletePost(${id})">삭제</button>
            </div>
        </div>
    `;
    document.getElementById('card-list').appendChild(wrapper);
}

function uploadPost() {
    const title = document.getElementById('input-title').value;
    const message = document.getElementById('input-text').value;

    fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.success) {
                alert('저장 완료!');
                location.reload();
            } else {
                alert(json.error || '저장 실패');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('서버 통신 오류(생성)');
        });
}

function deletePost(id) {
    fetch(`/api/boards/${id}`, {
        method: 'DELETE',
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.success) {
                alert('삭제 완료!');
                location.reload();
            } else {
                alert(json.error || '삭제 실패');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('서버 통신 오류(삭제)');
        });
}

function modifyPost(id) {
    const card = document.getElementById(`card_${id}`);
    const oldTitle = card.querySelector('.card-title').textContent;
    const oldText = card.querySelector('.card-text').textContent;

    // innerHTML 기반 편집 UI로 교체
    card.innerHTML = `
        <div class="card-body">
            <p class="card-id">${id}</p>
            <input class="form-control mb-2" id="mod-title-${id}" value="${oldTitle}">
            <input class="form-control mb-2" id="mod-text-${id}" value="${oldText}">
            <button class="btn btn-primary" onclick="updatePost(${id})">저장</button>
            <button class="btn btn-secondary ms-2" onclick="location.reload()">취소</button>
        </div>
    `;
}

function updatePost(id) {
    const title = document.getElementById(`mod-title-${id}`).value;
    const message = document.getElementById(`mod-text-${id}`).value;

    fetch(`/api/boards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.success) {
                alert('수정 완료!');
                location.reload();
            } else {
                alert(json.error || '수정 실패');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('서버 통신 오류(수정)');
        });
}
