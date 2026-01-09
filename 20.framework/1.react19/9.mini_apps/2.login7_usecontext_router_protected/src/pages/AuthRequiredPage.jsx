import { Link } from 'react-router-dom';

/**
 * 미로그인 사용자가 보호 페이지(/profile)에 접근했을 때 보여주는 안내 페이지
 */
export default function AuthRequiredPage() {
    return (
        <div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>로그인이 필요합니다</h2>
            <p style={{ opacity: 0.7, lineHeight: 1.5 }}>
                이 페이지는 로그인한 사용자만 접근할 수 있습니다. <br />
                로그인 후 다시 시도해 주세요.
            </p>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Link
                    to="/login"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid #ddd',
                        textDecoration: 'none',
                    }}
                >
                    로그인 하러 가기
                </Link>

                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid #ddd',
                        textDecoration: 'none',
                    }}
                >
                    홈으로
                </Link>
            </div>
        </div>
    );
}
