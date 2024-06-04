import { READY_STATE_DONE, HTTP_STATUS_OK } from './constants.js';

document.addEventListener('DOMContentLoaded', function () {
    let postId = 1; // 초기 포스트 ID 설정
    
    // 버튼 클릭 시 AJAX 요청 수행
    document.getElementById('loadContentBtn').addEventListener('click', function () {
        // AJAX 요청
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://jsonplaceholder.typicode.com/posts/${postId}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === READY_STATE_DONE) { // 4
                if (xhr.status === HTTP_STATUS_OK) { // 200
                    const data = JSON.parse(xhr.responseText);
                    // 성공적으로 데이터를 받아왔을 때 수행할 동작
                    document.getElementById('contentContainer').innerHTML =
                        `<p>Title: ${data.title}</p><p>Body: ${data.body}</p>`;
                    postId++; // 다음 포스트 ID로 증가
                } else {
                    // AJAX 요청이 실패했을 때 수행할 동작
                    alert('Failed to load content.');
                }
            }
        };
        xhr.send();
    });
});
