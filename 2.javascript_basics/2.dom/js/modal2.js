const open = document.getElementById('open');

open.onclick = () => {
    createModal();
};

function createModal() {
    // 모달 래퍼 생성
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal-wrapper';

    // 모달 본체 생성
    const modal = document.createElement('div');
    modal.className = 'modal';

    // 모달 제목 생성
    const modalTitle = document.createElement('div');
    modalTitle.className = 'modal-title';
    modalTitle.innerText = '안녕하세요';

    // 모달 내용 생성
    const modalContent = document.createElement('p');
    modalContent.innerText = '모달 내용은 어쩌고 저쩌고';

    // 닫기 버튼 생성
    const closeWrapper = document.createElement('div');
    closeWrapper.className = 'close-wrapper';

    const closeButton = document.createElement('button');
    closeButton.innerText = '닫기';

    // 닫기 이벤트: 클릭 시 모달 제거
    closeButton.onclick = () => {
        modalWrapper.remove();
    };

    // 구조 조립
    closeWrapper.appendChild(closeButton);
    modal.appendChild(modalTitle);
    modal.appendChild(modalContent);
    modal.appendChild(closeWrapper);
    modalWrapper.appendChild(modal);

    // body에 추가
    document.body.appendChild(modalWrapper);
}
