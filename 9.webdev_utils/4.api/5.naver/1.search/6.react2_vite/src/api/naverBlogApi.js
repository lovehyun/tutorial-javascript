const BASE_URL = 'http://127.0.0.1:3000/search/blog';

/**
 * 네이버 블로그 검색 (서버 프록시 엔드포인트 호출)
 * @param {object} params
 * @param {string} params.query
 * @param {number} [params.page=1]
 * @param {number} [params.display=10]
 * @param {AbortSignal} [params.signal]
 */
export async function fetchNaverBlogSearch({ query, page = 1, display = 10, signal } = {}) {
    const q = (query ?? '').trim();
    if (!q) return { items: [] };

    const url =
        `${BASE_URL}?query=${encodeURIComponent(q)}` +
        `&page=${encodeURIComponent(page)}` +
        `&display=${encodeURIComponent(display)}`;

    const res = await fetch(url, { signal });

    if (!res.ok) {
        // 서버가 JSON 에러를 주는 경우도 있으니 텍스트로 안전하게 읽어두기
        const bodyText = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText}${bodyText ? ` - ${bodyText}` : ''}`);
    }

    return res.json();
}
