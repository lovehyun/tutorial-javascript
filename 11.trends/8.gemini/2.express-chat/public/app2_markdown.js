const $messages = document.getElementById('messages');
const $form = document.getElementById('form');
const $input = document.getElementById('input');
const $status = document.getElementById('status');
const $resetBtn = document.getElementById('resetBtn');

function add(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'mb-2';

    const badge =
        role === 'user'
            ? `<span class="badge text-bg-primary me-2">나</span>`
            : `<span class="badge text-bg-success me-2">봇</span>`;

    // wrap.innerHTML = `${badge}<span>${escapeHtml(text)}</span>`;
    // wrap.innerHTML = `${badge}<div class="d-inline-block">${marked.parse(text)}</div>`;
    wrap.innerHTML = `
        <div class="d-flex align-items-start gap-2">
            ${badge}
            <div class="flex-grow-1">${marked.parse(text)}</div>
        </div>
    `;

    $messages.appendChild(wrap);
    $messages.scrollTop = $messages.scrollHeight;
}

function escapeHtml(s) {
    return s.replace(
        /[&<>"']/g,
        (m) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
            }[m])
    );
}

async function chat(message) {
    $status.textContent = '응답 생성 중...';
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });
    const data = await res.json();
    $status.textContent = '';
    if (!res.ok) throw new Error(data?.error || 'Request failed');
    return data.reply;
}

$form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = $input.value.trim();
    if (!text) return;

    add('user', text);
    $input.value = '';
    $input.focus();

    try {
        const reply = await chat(text);
        add('bot', reply);
    } catch (err) {
        add('bot', `오류: ${err.message}`);
    }
});

$resetBtn.addEventListener('click', async () => {
    await fetch('/api/reset', { method: 'POST' });
    $messages.innerHTML = '';
    add('bot', '대화를 초기화했습니다.');
});

// 첫 메시지
add('bot', '안녕하세요! 무엇을 도와드릴까요?');
