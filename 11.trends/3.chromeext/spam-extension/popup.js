document.addEventListener('DOMContentLoaded', function () {
    const checkSpamBtn = document.getElementById('checkSpamBtn');
    const classNameInput = document.getElementById('classNameInput');
    const resultDiv = document.getElementById('result');
    const statusText = document.getElementById('status');

    checkSpamBtn.addEventListener('click', function () {
        const className = classNameInput.value.trim();
        if (className) {
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
        } else {
            alert("Please enter a valid class name.");
        }
    });
});
