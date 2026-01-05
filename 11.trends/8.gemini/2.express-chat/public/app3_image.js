const $messages = document.getElementById('messages');
const $form = document.getElementById('form');
const $input = document.getElementById('input');
const $status = document.getElementById('status');
const $resetBtn = document.getElementById('resetBtn');

// Markdown 줄바꿈 자연스럽게
marked.setOptions({ breaks: true });

function addMessage(role, markdownText) {
    const wrap = document.createElement('div');
    wrap.className = 'mb-2';

    const badge =
        role === 'user'
            ? `<span class="badge text-bg-primary">나</span>`
            : `<span class="badge text-bg-success">봇</span>`;

    // ✅ 배지를 항상 “시작 줄”에 고정(align-items-start)
    // Markdown은 블록(<p>, <ul>...)로 시작하므로 span으로 감싸면 정렬이 어긋날 수 있습니다.
    wrap.innerHTML = `
    <div class="d-flex align-items-start gap-2">
      ${badge}
      <div class="flex-grow-1">${marked.parse(normalizeNewlines(markdownText))}</div>
    </div>
  `;

    $messages.appendChild(wrap);
    $messages.scrollTop = $messages.scrollHeight;
}

function addImage(role, dataUrl) {
    const wrap = document.createElement('div');
    wrap.className = 'mb-2';

    const badge =
        role === 'user'
            ? `<span class="badge text-bg-primary">나</span>`
            : `<span class="badge text-bg-success">봇</span>`;

    wrap.innerHTML = `
    <div class="d-flex align-items-start gap-2">
      ${badge}
      <div class="flex-grow-1">
        <img src="${dataUrl}" class="img-fluid rounded border" alt="generated" />
      </div>
    </div>
  `;

    $messages.appendChild(wrap);
    $messages.scrollTop = $messages.scrollHeight;
}

// 빈 줄 과다(3줄 이상)만 2줄로 정리(선택)
function normalizeNewlines(s) {
    return String(s || '').replace(/\n{3,}/g, '\n\n');
}

async function postJson(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Request failed');
    return data;
}

$form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = $input.value.trim();
    if (!text) return;

    addMessage('user', text);
    $input.value = '';
    $input.focus();

    try {
        $status.textContent = '응답 생성 중...';

        // /img 프롬프트 -> 이미지 생성
        if (text.startsWith('/img ')) {
            const prompt = text.slice(5).trim();
            const out = await postJson('/api/image', { prompt });

            if (out.type === 'image') {
                addMessage('bot', '이미지를 생성했습니다.');
                addImage('bot', out.dataUrl);
            } else {
                addMessage('bot', out.text || '이미지 생성 결과가 없습니다.');
            }
        } else {
            const out = await postJson('/api/chat', { message: text });
            addMessage('bot', out.reply || '(빈 응답)');
        }
    } catch (err) {
        addMessage('bot', `오류: ${err.message}`);
    } finally {
        $status.textContent = '';
    }
});

$resetBtn.addEventListener('click', async () => {
    await postJson('/api/reset', {});
    $messages.innerHTML = '';
    addMessage('bot', '대화를 초기화했습니다. 텍스트는 그대로 입력, 이미지는 `/img 사과`처럼 입력해 보세요.');
});

// 첫 메시지
addMessage('bot', '안녕하세요! 무엇을 도와드릴까요?\n\n- 텍스트: 그냥 입력\n- 이미지: `/img 사과`');
