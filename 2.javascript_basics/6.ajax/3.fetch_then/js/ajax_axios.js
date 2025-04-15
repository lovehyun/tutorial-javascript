import { READY_STATE_DONE, HTTP_STATUS_OK } from './constants.js';

document.addEventListener('DOMContentLoaded', function () {
    let postId = 1; // 초기 포스트 ID 설정
    
    // 버튼 클릭 시 AJAX 요청 수행
    document.getElementById('loadContentBtn').addEventListener('click', function () {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // 성공적으로 데이터를 받아왔을 때 수행할 동작
                document.getElementById('contentContainer').innerHTML =
                    `<p>Title: ${data.title}</p><p>Body: ${data.body}</p>`;
                postId++; // 다음 포스트 ID로 증가
            })
            .catch(error => {
                // AJAX 요청이 실패했을 때 수행할 동작
                alert('Failed to load content.');
                console.error('There was a problem with the fetch operation:', error);
            });
    });
});
