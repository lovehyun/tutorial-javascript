// 닉네임 — 로컬스토리지에 저장
(function (global) {
    const KEY = 'multi-shoot:nickname';

    function get() {
        return localStorage.getItem(KEY) || '';
    }

    function set(name) {
        const n = (name || '').trim().slice(0, 20);
        if (!n) return null;
        localStorage.setItem(KEY, n);
        return n;
    }

    function ensure() {
        let n = get();
        if (!n) {
            n = prompt('닉네임을 입력해주세요 (최대 20자):', '플레이어' + Math.floor(Math.random() * 1000));
            if (n) set(n);
            else   set('익명' + Math.floor(Math.random() * 1000));
        }
        return get();
    }

    function change() {
        const cur = get();
        const n = prompt('새 닉네임을 입력해주세요:', cur);
        if (n && n.trim()) {
            return set(n);
        }
        return cur;
    }

    global.MultiShoot = global.MultiShoot || {};
    global.MultiShoot.nickname = { get, set, ensure, change };
})(window);
