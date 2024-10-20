document.addEventListener('DOMContentLoaded', function () {
    const checkSpamBtn = document.getElementById('checkSpamBtn');
    const classNameInput = document.getElementById('classNameInput');
    const resultDiv = document.getElementById('result');
    const statusText = document.getElementById('status');

    // chrome.storage.local에서 저장된 값을 불러와서 input에 설정
    chrome.storage.local.get('savedClassName', function (result) {
        if (result.savedClassName) {
            classNameInput.value = result.savedClassName;
        }
    });

    checkSpamBtn.addEventListener('click', function () {
        let className = classNameInput.value ? classNameInput.value.trim() : null;

        if (className) {
            // 입력한 className을 chrome.storage.local에 저장
            chrome.storage.local.set({ savedClassName: className }, function () {
                console.log('Class name has been saved to Chrome storage.');
            });
        }
        
        // className을 백그라운드 스크립트로 전송
        chrome.runtime.sendMessage({ action: 'checkSpam', className: className }, function (response) {
            resultDiv.classList.remove('hidden');
            if (response && response.emailContent) {
                // 서버로 이메일 데이터 전송
                fetch('http://127.0.0.1:5000/spam-check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ emailContent: response.emailContent })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.is_spam) {
                        statusText.textContent = 'This email is marked as SPAM.';
                        statusText.style.color = 'red';
                    } else {
                        statusText.textContent = 'This email is NOT spam.';
                        statusText.style.color = 'green';
                    }
                });
            } else {
                statusText.textContent = 'No email content found.';
                statusText.style.color = 'gray';
            }
        });
    });
});
