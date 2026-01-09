export function fakeLoginApi({ id, pw }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 'admin' && pw === '1234') {
                resolve({ ok: true, user: { id } });
            } else { 
                reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
            }
        }, 1000);
    });
}
