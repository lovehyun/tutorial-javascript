// public/js/videoPlayer.js

document.addEventListener('DOMContentLoaded', function () {
    // DOM 요소 가져오기
    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');
    const videoViews = document.getElementById('video-views');
    const videoDate = document.getElementById('video-date');
    const videoDescription = document.getElementById('video-description-text');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCount = document.getElementById('like-count');
    const dislikeCount = document.getElementById('dislike-count');
    const shareBtn = document.getElementById('share-btn');
    const commentInput = document.getElementById('comment-input');
    const commentSubmit = document.getElementById('comment-submit');
    const commentsContainer = document.getElementById('comments-container');
    const relatedVideos = document.getElementById('related-videos');

    // 현재 비디오 ID 가져오기
    const videoId = window.location.pathname.split('/').pop();

    // 비디오 및 관련 데이터 로드
    loadVideo(videoId);
    loadComments(videoId);
    loadRelatedVideos(videoId);

    // 이벤트 리스너 등록
    if (likeBtn) {
        likeBtn.addEventListener('click', () => handleLike(videoId));
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', () => handleDislike(videoId));
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', shareVideo);
    }

    if (commentSubmit) {
        commentSubmit.addEventListener('click', () => addComment(videoId));
    }

    // 사용자 상태 확인
    checkUserStatus();

    // 비디오 로드 함수
    async function loadVideo(id) {
        try {
            const response = await fetch(`/api/videos/${id}`);

            if (!response.ok) {
                throw new Error('비디오를 찾을 수 없습니다.');
            }

            const video = await response.json();

            // 비디오 소스 설정
            videoPlayer.src = `/api/videos/stream/${id}`;

            // 비디오 제목 설정
            if (videoTitle) {
                videoTitle.textContent = video.title;
            }

            // 비디오 조회수 설정
            if (videoViews) {
                videoViews.textContent = `조회수 ${video.views || 0}회`;
            }

            // 비디오 날짜 설정
            if (videoDate) {
                const uploadDate = new Date(video.uploadDate);
                videoDate.textContent = `${uploadDate.getFullYear()}년 ${
                    uploadDate.getMonth() + 1
                }월 ${uploadDate.getDate()}일`;
            }

            // 비디오 설명 설정
            if (videoDescription) {
                videoDescription.textContent = video.description || '설명이 없습니다.';
            }

            // 좋아요/싫어요 수 설정
            if (likeCount) {
                likeCount.textContent = video.likes || 0;
            }

            if (dislikeCount) {
                dislikeCount.textContent = video.dislikes || 0;
            }

            // 비디오 로드 후 조회수 증가
            incrementViews(id);

            // 문서 제목 설정
            document.title = `${video.title} - MyTube`;
        } catch (error) {
            console.error('비디오 로드 중 오류 발생:', error);
            alert('비디오를 로드하는데 실패했습니다.');
            // 오류 시 홈으로 리다이렉트
            // window.location.href = '/';
        }
    }

    // 비디오 조회수 증가 함수
    async function incrementViews(id) {
        try {
            await fetch(`/api/videos/${id}/view`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('조회수 증가 중 오류 발생:', error);
        }
    }

    // 댓글 로드 함수
    async function loadComments(id) {
        try {
            const response = await fetch(`/api/videos/${id}/comments`);
            const comments = await response.json();

            if (!commentsContainer) return;

            commentsContainer.innerHTML = '';

            if (comments.length === 0) {
                commentsContainer.innerHTML = '<p class="no-comments">아직 댓글이 없습니다.</p>';
                return;
            }

            comments.forEach((comment) => {
                const commentElement = createCommentElement(comment);
                commentsContainer.appendChild(commentElement);
            });
        } catch (error) {
            console.error('댓글 로드 중 오류 발생:', error);
            if (commentsContainer) {
                commentsContainer.innerHTML = '<p class="error">댓글을 불러오는데 실패했습니다.</p>';
            }
        }
    }

    // 댓글 엘리먼트 생성 함수
    function createCommentElement(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // 댓글 등록 날짜 계산
        const commentDate = new Date(comment.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - commentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let timeAgo;
        if (diffDays === 0) {
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            if (diffHours < 1) {
                const diffMinutes = Math.ceil(diffTime / (1000 * 60));
                timeAgo = `${diffMinutes}분 전`;
            } else {
                timeAgo = `${diffHours}시간 전`;
            }
        } else if (diffDays === 1) {
            timeAgo = '어제';
        } else if (diffDays < 7) {
            timeAgo = `${diffDays}일 전`;
        } else if (diffDays < 30) {
            timeAgo = `${Math.ceil(diffDays / 7)}주 전`;
        } else if (diffDays < 365) {
            timeAgo = `${Math.ceil(diffDays / 30)}개월 전`;
        } else {
            timeAgo = `${Math.ceil(diffDays / 365)}년 전`;
        }

        commentDiv.innerHTML = `
        <div class="comment-avatar"></div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">사용자 ${comment.userId}</span>
            <span class="comment-date">${timeAgo}</span>
          </div>
          <p class="comment-text">${comment.text}</p>
        </div>
      `;

        return commentDiv;
    }

    // 댓글 추가 함수
    async function addComment(videoId) {
        // 로그인 상태 확인
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('댓글을 작성하려면 로그인이 필요합니다.');
            return;
        }

        const commentText = commentInput.value.trim();

        if (!commentText) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            const response = await fetch(`/api/videos/${videoId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: commentText,
                    userId: user.id,
                }),
            });

            if (!response.ok) {
                throw new Error('댓글 추가 실패');
            }

            // 댓글 입력창 초기화
            commentInput.value = '';

            // 댓글 목록 새로고침
            loadComments(videoId);
        } catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
            alert('댓글 추가에 실패했습니다. 나중에 다시 시도해주세요.');
        }
    }

    // 관련 비디오 로드 함수
    async function loadRelatedVideos(currentVideoId) {
        try {
            const response = await fetch('/api/videos');
            const videos = await response.json();

            if (!relatedVideos) return;

            // 현재 비디오를 제외한 최대 5개의 비디오 선택
            const filteredVideos = videos.filter((video) => video.id !== parseInt(currentVideoId)).slice(0, 5);

            if (filteredVideos.length === 0) {
                relatedVideos.innerHTML = '<p class="no-videos">관련 동영상이 없습니다.</p>';
                return;
            }

            relatedVideos.innerHTML = '';

            filteredVideos.forEach((video) => {
                const videoElement = createRelatedVideoElement(video);
                relatedVideos.appendChild(videoElement);
            });
        } catch (error) {
            console.error('관련 비디오 로드 중 오류 발생:', error);
            if (relatedVideos) {
                relatedVideos.innerHTML = '<p class="error">관련 동영상을 불러오는데 실패했습니다.</p>';
            }
        }
    }

    // 관련 비디오 엘리먼트 생성 함수
    function createRelatedVideoElement(video) {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'sidebar-video';
        videoDiv.onclick = function () {
            window.location.href = `/video/${video.id}`;
        };

        // 업로드 날짜 포맷팅
        const uploadDate = new Date(video.uploadDate);
        const now = new Date();
        const diffTime = Math.abs(now - uploadDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let timeAgo;
        if (diffDays === 0) {
            timeAgo = '오늘';
        } else if (diffDays === 1) {
            timeAgo = '어제';
        } else if (diffDays < 7) {
            timeAgo = `${diffDays}일 전`;
        } else if (diffDays < 30) {
            timeAgo = `${Math.ceil(diffDays / 7)}주 전`;
        } else if (diffDays < 365) {
            timeAgo = `${Math.ceil(diffDays / 30)}개월 전`;
        } else {
            timeAgo = `${Math.ceil(diffDays / 365)}년 전`;
        }

        videoDiv.innerHTML = `
        <div class="sidebar-thumbnail">
          <img src="/api/videos/${video.id}/thumbnail" alt="${
            video.title
        }" onerror="this.src='/img/default-thumbnail.jpg'">
        </div>
        <div class="sidebar-video-info">
          <h4 class="sidebar-video-title">${video.title}</h4>
          <p class="sidebar-channel-name">채널 이름</p>
          <div class="sidebar-video-meta">
            <span>조회수 ${video.views || 0}회</span> • <span>${timeAgo}</span>
          </div>
        </div>
      `;

        return videoDiv;
    }

    // 좋아요 처리 함수
    async function handleLike(videoId) {
        // 로그인 상태 확인
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('좋아요를 누르려면 로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch(`/api/videos/${videoId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });

            if (!response.ok) {
                throw new Error('좋아요 처리 실패');
            }

            // 비디오 정보 새로고침
            loadVideo(videoId);
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error);
            alert('좋아요 처리에 실패했습니다. 나중에 다시 시도해주세요.');
        }
    }

    // 싫어요 처리 함수
    async function handleDislike(videoId) {
        // 로그인 상태 확인
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('싫어요를 누르려면 로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch(`/api/videos/${videoId}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });

            if (!response.ok) {
                throw new Error('싫어요 처리 실패');
            }

            // 비디오 정보 새로고침
            loadVideo(videoId);
        } catch (error) {
            console.error('싫어요 처리 중 오류 발생:', error);
            alert('싫어요 처리에 실패했습니다. 나중에 다시 시도해주세요.');
        }
    }

    // 공유 기능
    function shareVideo() {
        const videoUrl = window.location.href;

        // 네이티브 공유 API가 있는 경우 사용
        if (navigator.share) {
            navigator
                .share({
                    title: document.title,
                    url: videoUrl,
                })
                .catch((error) => console.error('공유 실패:', error));
        } else {
            // 클립보드에 URL 복사
            navigator.clipboard
                .writeText(videoUrl)
                .then(() => alert('URL이 클립보드에 복사되었습니다.'))
                .catch((err) => {
                    console.error('클립보드 복사 실패:', err);
                    // 폴백: 수동으로 URL 선택하게 함
                    prompt('아래 URL을 복사하세요:', videoUrl);
                });
        }
    }

    // 사용자 상태 확인
    function checkUserStatus() {
        const user = JSON.parse(localStorage.getItem('user'));
        const loginBtn = document.getElementById('login-btn');

        if (user && loginBtn) {
            // 로그인 상태일 때 UI 변경
            loginBtn.textContent = user.username;
            loginBtn.onclick = handleLogout;
        }
    }

    // 로그아웃 처리
    function handleLogout() {
        // 로컬 스토리지에서 사용자 정보 제거
        localStorage.removeItem('user');

        // 화면 새로고침하여 로그아웃 상태 반영
        window.location.reload();
    }
});
