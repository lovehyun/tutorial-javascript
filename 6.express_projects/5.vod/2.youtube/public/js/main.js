// public/js/main.js

document.addEventListener('DOMContentLoaded', function () {
    // DOM 요소 가져오기
    const videosContainer = document.getElementById('videos-container');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const registerLink = document.getElementById('register-link');
    const closeButtons = document.querySelectorAll('.close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 비디오 목록 로드
    loadVideos();

    // 사용자 상태 확인
    checkUserStatus();

    // 이벤트 리스너 등록
    loginBtn.addEventListener('click', openLoginModal);

    closeButtons.forEach((button) => {
        button.addEventListener('click', closeModals);
    });

    window.addEventListener('click', function (event) {
        if (event.target === loginModal) {
            closeModals();
        }
        if (event.target === registerModal) {
            closeModals();
        }
    });

    if (registerLink) {
        registerLink.addEventListener('click', function (event) {
            event.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            searchVideos(searchInput.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                searchVideos(searchInput.value);
            }
        });
    }

    // 비디오 목록 로드 함수
    async function loadVideos() {
        try {
            const response = await fetch('/api/videos');
            const videos = await response.json();

            if (videos.length === 0) {
                videosContainer.innerHTML = '<p class="no-videos">아직 업로드된 비디오가 없습니다.</p>';
                return;
            }

            videosContainer.innerHTML = '';

            videos.forEach((video) => {
                const videoCard = createVideoCard(video);
                videosContainer.appendChild(videoCard);
            });
        } catch (error) {
            console.error('비디오 로드 중 오류 발생:', error);
            videosContainer.innerHTML =
                '<p class="error">비디오를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</p>';
        }
    }

    // 비디오 카드 생성 함수
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.onclick = function () {
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

        card.innerHTML = `
        <div class="thumbnail">
          <img src="/api/videos/${video.id}/thumbnail" alt="${
            video.title
        }" onerror="this.src='/img/default-thumbnail.jpg'">
          <span class="duration">3:45</span>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.title}</h3>
          <p class="channel-name">채널 이름</p>
          <div class="video-meta">
            <span>조회수 ${video.views || 0}회</span>
            <span>${timeAgo}</span>
          </div>
        </div>
      `;

        return card;
    }

    // 검색 기능
    async function searchVideos(query) {
        if (!query.trim()) {
            loadVideos();
            return;
        }

        try {
            const response = await fetch(`/api/videos/search?q=${encodeURIComponent(query)}`);
            const videos = await response.json();

            videosContainer.innerHTML = '';

            if (videos.length === 0) {
                videosContainer.innerHTML = '<p class="no-videos">검색 결과가 없습니다.</p>';
                return;
            }

            videos.forEach((video) => {
                const videoCard = createVideoCard(video);
                videosContainer.appendChild(videoCard);
            });
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            videosContainer.innerHTML = '<p class="error">검색에 실패했습니다. 나중에 다시 시도해주세요.</p>';
        }
    }

    // 로그인 처리
    async function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('로그인 실패');
            }

            const data = await response.json();

            // 로컬 스토리지에 사용자 정보 저장
            localStorage.setItem('user', JSON.stringify(data));

            // 모달 닫기
            closeModals();

            // 화면 새로고침하여 로그인 상태 반영
            window.location.reload();
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
            alert('로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인해주세요.');
        }
    }

    // 회원가입 처리
    async function handleRegister(event) {
        event.preventDefault();

        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '회원가입 실패');
            }

            const data = await response.json();

            alert('회원가입이 완료되었습니다. 로그인해주세요.');

            // 회원가입 모달 닫고 로그인 모달 표시
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';

            // 회원가입 폼 초기화
            registerForm.reset();
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert(`회원가입에 실패했습니다: ${error.message}`);
        }
    }

    // 사용자 상태 확인
    function checkUserStatus() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
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

    // 모달 열기
    function openLoginModal() {
        loginModal.style.display = 'block';
    }

    // 모달 닫기
    function closeModals() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    }
});
