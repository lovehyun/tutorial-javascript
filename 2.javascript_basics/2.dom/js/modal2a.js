const open = document.getElementById('open');

open.onclick = () => {
    showModal();
};

function showModal() {
    // 모달을 감싸는 div를 생성
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal-wrapper';

    // innerHTML로 모달 전체 구성
    modalWrapper.innerHTML = `
        <div class="modal">
            <div class="modal-title">안녕하세요</div>
            <p>모달 내용은 어쩌고 저쩌고</p>
            <div class="close-wrapper">
                <button id="close">닫기</button>
            </div>
        </div>
    `;

    // body에 추가
    document.body.appendChild(modalWrapper);

    // 닫기 버튼 이벤트
    document.getElementById('close').onclick = () => {
        modalWrapper.remove();
    };
}
