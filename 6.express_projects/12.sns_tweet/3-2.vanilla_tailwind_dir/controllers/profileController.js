const { userModel } = require('../models');

// 사용자 프로필 수정
function updateProfile(req, res) {
    const { username, email } = req.body;

    // 모든 필수 입력값 체크
    if (!username || !email) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    // 현재 로그인한 사용자의 프로필 업데이트
    userModel.updateUserProfile(req.session.user.id, username, email, (err) => {
        if (err) {
            return res.status(400).json({ error: '이미 존재하는 사용자명 또는 이메일입니다.' });
        }
        res.json({ message: '프로필 수정 완료!' });
    });
}

// 사용자 비밀번호 변경
function changePassword(req, res) {
    const { current_password, new_password } = req.body;

    // 모든 필수 입력값 체크
    if (!current_password || !new_password) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }

    // 현재 로그인한 사용자 조회
    userModel.findUserById(req.session.user.id, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 기존 비밀번호 확인
        if (user.password !== current_password) {
            return res.status(400).json({ error: '기존 비밀번호가 일치하지 않습니다.' });
        }

        // 새 비밀번호로 업데이트
        userModel.updatePassword(req.session.user.id, new_password, (err) => {
            if (err) {
                return res.status(500).json({ error: '비밀번호 변경 실패' });
            }
            res.json({ message: '비밀번호가 변경되었습니다.' });
        });
    });
}

module.exports = { 
    updateProfile, 
    changePassword 
};
