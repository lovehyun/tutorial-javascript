// 포인트:
//  - 데이터는 loader에서 받음 (useLoaderData)
//  - 삭제는 <Form action="/users/:id/delete" method="post">
//  - "삭제 중…" 표시는 useNavigation()로 감지

// BR: 삭제 요청/로딩/성공 후 이동을 컴포넌트 이벤트(onClick)에서 직접 처리
// CBR: 삭제 요청을 라우트 action으로 위임하고, 컴포넌트는 Form 제출만 함

import { Link, Form, useLoaderData, useNavigation } from 'react-router-dom';

export default function Users() {
    const users = useLoaderData();
    const navigation = useNavigation();

    // action submit 중인지
    const isSubmitting = navigation.state === 'submitting';

    // 어떤 userId를 삭제 중인지(폼 action URL에서 추출)
    const deletingId = (() => {
        if (!isSubmitting) return null;
        const action = navigation.formAction || '';
        // 예: "/users/3/delete"
        const m = action.match(/\/users\/(\d+)\/delete$/);
        return m ? m[1] : null;
    })();

    return (
        <div>
            <h1>Users</h1>
            <p>목록: 이름만 표시 + 삭제(action)</p>

            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        <Link to={`/users/${u.id}`}>{u.name}</Link>

                        {/* li 기본 bullet 유지, 버튼에만 간격 */}
                        <Form method="post" action={`/users/${u.id}/delete`} style={{ display: 'inline' }}>
                            <button
                                type="submit"
                                style={{ marginLeft: 8 }}
                                disabled={isSubmitting} // 학습용: 한 번에 하나만
                            >
                                {String(u.id) === String(deletingId) ? '삭제 중…' : '삭제'}
                            </button>
                        </Form>
                    </li>
                ))}
            </ul>

            {users.length === 0 && <p>표시할 사용자가 없습니다.</p>}
        </div>
    );
}
