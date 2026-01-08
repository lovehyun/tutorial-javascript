// 포인트: 
//  - 상세 데이터도 loader로 받음
//  - 삭제는 상세 화면에서 제출하되, action은 같은 /users/:id/delete

import { Link, Form, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';

export default function UserDetail() {
    const user = useLoaderData();
    const navigate = useNavigate(); // 이동을 시키는 버튼
    const navigation = useNavigation(); // 이동/제출 상태를 관찰하는 계기판

    // useNavigation() 이 주는 핵심 정보
    // navigation.state = idle / loading (loader 실행 중 - 페이지 이동) / submitting (action 실행 중 - Form 제출)
    // navigation.formAction = 어떤 action 으로 submit 중인지 (예, /users/3/delete)
    // navigation.formMethod = "post" / "put" / "delete" 등
    
    // BR 에서는 우리가 컴포넌트를 통해서 직접 관리 (예, const [loading, setLoading] = useState(false);)
    // CBR 에서는 라우터가 이미 알고 있어서, 라우터에서 상태를 물어보는 API가 존재 함.

    const isSubmitting = navigation.state === 'submitting';
    const deletingThis = isSubmitting && (navigation.formAction || '').endsWith(`/users/${user.id}/delete`);

    return (
        <div>
            <h1>User Detail</h1>

            <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, maxWidth: 520 }}>
                <div>
                    <b>ID</b>: {user.id}
                </div>
                <div>
                    <b>Name</b>: {user.name}
                </div>
                <div>
                    <b>Email</b>: {user.email}
                </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(-1)} disabled={isSubmitting}>
                    뒤로
                </button>

                <Link to="/users">목록</Link>

                {/* 최소 컨셉
                <Form method="post" action={`/users/${user.id}/delete`}>
                    <button type="submit">삭제</button>
                </Form>
                 */}

                {/* 삭제중... 등 디테일 추가 */}
                <Form method="post" action={`/users/${user.id}/delete`}>
                    <button type="submit" disabled={isSubmitting}>
                        {deletingThis ? '삭제 중…' : '삭제'}
                    </button>
                </Form>
            </div>
        </div>
    );
}
