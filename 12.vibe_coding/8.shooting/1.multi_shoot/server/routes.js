const { getClientIP } = require('./utils');

module.exports = function setupRoutes(app, db) {
    // 명예의 전당
    app.get('/api/halloffame', (req, res) => {
        res.json({
            byScore: db.topByScore(10),
            byStage: db.topByStage(10),
        });
    });

    // 통계 대시보드용 데이터
    app.get('/api/stats', (req, res) => {
        const sinceMs = Date.now() - 30 * 24 * 60 * 60 * 1000;  // 최근 30일
        const ov      = db.overview();

        res.json({
            overview: {
                totalPlays:    ov.total_plays,
                uniqueIPs:     ov.unique_ips,
                avgScore:      Math.round(ov.avg_score),
                maxScore:      ov.max_score,
                avgStage:      Number(ov.avg_stage.toFixed(2)),
                topStage:      ov.top_stage,
                accuracy:      ov.total_shots ? Math.round(ov.total_hits * 100 / ov.total_shots) : 0,
                avgDurationS:  Math.round(ov.avg_duration_ms / 1000),
            },
            topIPs:         db.topIPs(10),
            playsPerDay:    db.playsPerDay(sinceMs),
            scoreHistogram: db.scoreHistogram(),
            stageHistogram: db.stageHistogram(),
        });
    });

    // 디버그용 — 클라이언트에 자기 IP 알려주기
    app.get('/api/whoami', (req, res) => {
        res.json({ ip: getClientIP(req) });
    });
};
