/**
 * 방 목록 조회, 방 생성 (10 크레딧 차감)
 * - 방 데이터는 wsServer의 인메모리 Map 사용
 */
const express = require('express');
const router = express.Router();
const users = require('../database/users');
const { requireAuthApi, attachUser } = require('../middleware/auth');
const { getRooms } = require('../wsServer');

router.use(attachUser);
router.use(requireAuthApi);

/** 방 목록 (이름, 인원수, 참여자 목록) */
router.get('/rooms/detail', (req, res) => {
    const rooms = getRooms();
    const data = Array.from(rooms.entries()).map(([roomName, roomInfo]) => ({
        roomName,
        userCount: roomInfo.users.size,
        users: Array.from(roomInfo.users.keys()),
    }));
    res.json(data);
});

/** 방 생성: 10 크레딧 차감 후 rooms에 추가 */
router.post('/create-room', (req, res) => {
    const { roomName } = req.body || {};
    const name = (roomName || '').trim();
    if (!name) {
        return res.status(400).json({ error: '방 이름을 입력해주세요.' });
    }

    const rooms = getRooms();
    if (rooms.has(name)) {
        return res.status(400).json({ error: '이미 존재하는 방입니다.' });
    }

    const user = users.findById(req.user.id);
    if (user.credits < 10) {
        return res.status(400).json({ error: '크레딧이 부족합니다. (방 생성 10 크레딧 필요)' });
    }

    users.subtractCredits(req.user.id, 10, 'room_create', name);
    rooms.set(name, { users: new Map() });
    const updated = users.findById(req.user.id);
    console.log(`[ROOM CREATE] ${user.username} created "${name}" (credits: ${updated.credits})`);
    res.status(201).json({ message: `방 "${name}" 생성 완료!`, credits: updated.credits });
});

module.exports = router;
