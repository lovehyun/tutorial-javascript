const { User } = require('../models');

async function updateProfile(req, res) {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ error: '모든 필드를 입력하세요.' });
    }
    try {
        await User.update({ username, email }, { where: { id: req.session.user.id } });
        res.json({ message: '프로필 수정 완료!' });
    } catch (error) {
        res.status(400).json({ error: '이미 존재하는 사용자명 또는 이메일입니다.' });
    }
}

async function changePassword(req, res) {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    if (user.password !== current_password) {
        return res.status(400).json({ error: '기존 비밀번호가 일치하지 않습니다.' });
    }

    await User.update({ password: new_password }, { where: { id: req.session.user.id } });
    res.json({ message: '비밀번호가 변경되었습니다.' });
}

module.exports = {
    updateProfile,
    changePassword,
};
