module.exports = {
    PORT:           parseInt(process.env.PORT, 10) || 3000,
    DB_PATH:        process.env.DB_PATH || './data/multi-shoot.db',

    MAX_ROOMS:      3,
    MAX_PER_ROOM:   5,

    TICK_RATE:      30,    // 서버 시뮬레이션 주기(Hz)
    BROADCAST_RATE: 20,    // 상태 브로드캐스트 주기(Hz)

    WORLD: {
        width:  1600,
        height: 900,
    },

    CHAT_HISTORY:   50,
};
