// public/js/upload.js

document.addEventListener('DOMContentLoaded', function () {
    // DOM 요소 가져오기
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('video-file');
    const filePreview = document.getElementById('file-preview');
    const previewPlayer = document.getElementById('preview-player');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const changeFileBtn = document.getElementById('change-file-btn');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const uploadBtn = document.getElementById('upload-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressStatus = document.getElementById('progress-status');
    const uploadForm = document.getElementById('upload-form');
    const customThumbnail = document.getElementById('custom-thumbnail');
    const autoThumbnail = document.getElementById('auto-thumbnail');
    const customThumbnailUpload = document.getElementById('custom-thumbnail-upload');

    // 사용자 상태 확인
    checkUserStatus();

    // 이벤트 리스너 등록
    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', function () {
        dropZone.classList.remove('active');
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.classList.remove('active');

        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', function () {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });

    changeFileBtn.addEventListener('click', function () {
        // 파일 선택 초기화
        fileInput.value = '';
        // 미리보기 숨기기
        filePreview.style.display = 'none';
        // 드롭존 표시
        dropZone.style.display = 'block';
        // 업로드 버튼 비활성화
        uploadBtn.disabled = true;
    });

    videoTitle.addEventListener('input', validateForm);

    if (customThumbnail) {
        customThumbnail.addEventListener('change', function () {
            if (this.checked) {
                customThumbnailUpload.style.display = 'block';
            }
        });
    }

    if (autoThumbnail) {
        autoThumbnail.addEventListener('change', function () {
            if (this.checked) {
                customThumbnailUpload.style.display = 'none';
            }
        });
    }

    cancelBtn.addEventListener('click', function () {
        // 홈페이지로 이동
        window.location.href = '/';
    });

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        uploadVideo();
    });

    // 선택된 비디오 파일 처리 함수
    function handleFile(file) {
        // 파일 타입 확인
        if (!file.type.startsWith('video/')) {
            alert('비디오 파일만 업로드할 수 있습니다.');
            return;
        }

        // 파일 크기 확인 (100MB 제한)
        if (file.size > 100 * 1024 * 1024) {
            alert('파일 크기는 100MB를 초과할 수 없습니다.');
            return;
        }

        // 드롭존 숨기기
        dropZone.style.display = 'none';

        // 파일 정보 표시
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);

        // 비디오 미리보기 설정
        const videoURL = URL.createObjectURL(file);
        previewPlayer.src = videoURL;

        // 파일 제목 설정 (확장자 제외)
        const titleWithoutExt = file.name.split('.').slice(0, -1).join('.');
        videoTitle.value = titleWithoutExt;

        // 미리보기 표시
        filePreview.style.display = 'block';

        // 폼 유효성 검사
        validateForm();
    }

    // 파일 크기 포맷팅 함수
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 폼 유효성 검사 함수
    function validateForm() {
        // 파일과 제목이 있을 때만 업로드 버튼 활성화
        if (fileInput.files.length && videoTitle.value.trim()) {
            uploadBtn.disabled = false;
        } else {
            uploadBtn.disabled = true;
        }
    }

    // 비디오 업로드 함수
    async function uploadVideo() {
        // 로그인 상태 확인
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert('비디오를 업로드하려면 로그인이 필요합니다.');
            return;
        }

        // 폼 데이터 생성
        const formData = new FormData();
        formData.append('videoFile', fileInput.files[0]);
        formData.append('title', videoTitle.value);
        formData.append('description', videoDescription.value);

        // 사용자 ID 추가
        formData.append('userId', user.id);

        // 커스텀 썸네일이 선택된 경우
        const thumbnailInput = document.getElementById('thumbnail-file');
        if (customThumbnail.checked && thumbnailInput.files.length) {
            formData.append('thumbnailFile', thumbnailInput.files[0]);
        }

        // 공개 설정 추가
        const visibility = document.querySelector('input[name="visibility"]:checked').value;
        formData.append('visibility', visibility);

        try {
            // 업로드 상태 표시
            uploadProgress.style.display = 'block';
            uploadBtn.disabled = true;

            // 실제 프로젝트에서는 XMLHttpRequest 또는 fetch의 progress 옵션 사용
            // 여기서는 간단한 시뮬레이션
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    progressFill.style.width = percentComplete + '%';
                    progressStatus.textContent = percentComplete + '%';
                }
            });

            xhr.addEventListener('load', function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    // 업로드 성공 시 비디오 페이지로 이동
                    window.location.href = `/video/${response.id}`;
                } else {
                    throw new Error('업로드 실패: ' + xhr.statusText);
                }
            });

            xhr.addEventListener('error', function () {
                throw new Error('네트워크 오류 발생');
            });

            xhr.open('POST', '/api/videos');
            xhr.send(formData);
        } catch (error) {
            console.error('업로드 중 오류 발생:', error);
            alert('비디오 업로드에 실패했습니다. 나중에 다시 시도해주세요.');

            // 업로드 진행 상태 초기화
            uploadProgress.style.display = 'none';
            uploadBtn.disabled = false;
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
        } else {
            // 비로그인 상태에서는 메인 페이지로 리디렉션
            // alert('로그인이 필요한 페이지입니다.');
            // window.location.href = '/';
            // 참고: 실제 서비스에서는 리디렉션하는 것이 좋지만
            // 데모 목적상 주석 처리합니다.
        }
    }

    // 로그아웃 처리
    function handleLogout() {
        // 로컬 스토리지에서 사용자 정보 제거
        localStorage.removeItem('user');

        // 메인 페이지로 이동
        window.location.href = '/';
    }
});
