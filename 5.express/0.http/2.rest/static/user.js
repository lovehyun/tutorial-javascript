document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const username = document.getElementById('username');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = username.value;

        if (!name) {
            alert('이름을 입력하세요.');
            return;
        }

        try {
            const response = await fetch('/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                alert('등록 성공');
                username.value = ''; // 입력 필드 초기화
            } else {
                const errorMessage = await response.text();
                alert(`등록 실패: ${errorMessage}`);
            }
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    });
});
