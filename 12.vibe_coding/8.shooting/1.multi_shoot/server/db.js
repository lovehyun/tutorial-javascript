const Database = require('better-sqlite3');
const fs       = require('fs');
const path     = require('path');
const config   = require('./config');

const dbPath = path.resolve(config.DB_PATH);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS plays (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname      TEXT NOT NULL,
        ip            TEXT,
        final_score   INTEGER NOT NULL,
        max_stage     INTEGER NOT NULL,
        shots_fired   INTEGER NOT NULL,
        shots_hit     INTEGER NOT NULL,
        started_at    INTEGER NOT NULL,
        ended_at      INTEGER NOT NULL,
        duration_ms   INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_plays_score ON plays(final_score DESC);
    CREATE INDEX IF NOT EXISTS idx_plays_stage ON plays(max_stage   DESC);
    CREATE INDEX IF NOT EXISTS idx_plays_ip    ON plays(ip);
    CREATE INDEX IF NOT EXISTS idx_plays_ended ON plays(ended_at);
`);

const stmt = {
    insert: db.prepare(`
        INSERT INTO plays
            (nickname, ip, final_score, max_stage, shots_fired, shots_hit, started_at, ended_at, duration_ms)
        VALUES
            (@nickname, @ip, @final_score, @max_stage, @shots_fired, @shots_hit, @started_at, @ended_at, @duration_ms)
    `),
    topByScore: db.prepare(`
        SELECT nickname, final_score, max_stage, ended_at, duration_ms
        FROM plays
        ORDER BY final_score DESC, max_stage DESC, ended_at DESC
        LIMIT ?
    `),
    topByStage: db.prepare(`
        SELECT nickname, final_score, max_stage, ended_at, duration_ms
        FROM plays
        ORDER BY max_stage DESC, final_score DESC, ended_at DESC
        LIMIT ?
    `),
    overview: db.prepare(`
        SELECT
            COUNT(*)                                                 AS total_plays,
            COUNT(DISTINCT ip)                                       AS unique_ips,
            COALESCE(AVG(final_score), 0)                            AS avg_score,
            COALESCE(MAX(final_score), 0)                            AS max_score,
            COALESCE(AVG(max_stage),   0)                            AS avg_stage,
            COALESCE(MAX(max_stage),   0)                            AS top_stage,
            COALESCE(SUM(shots_fired), 0)                            AS total_shots,
            COALESCE(SUM(shots_hit),   0)                            AS total_hits,
            COALESCE(AVG(duration_ms), 0)                            AS avg_duration_ms
        FROM plays
    `),
    topIPs: db.prepare(`
        SELECT
            ip,
            COUNT(*)        AS plays,
            MAX(final_score) AS best_score,
            MAX(max_stage)   AS best_stage,
            SUM(final_score) AS total_score
        FROM plays
        WHERE ip IS NOT NULL
        GROUP BY ip
        ORDER BY plays DESC, best_score DESC
        LIMIT ?
    `),
    playsPerDay: db.prepare(`
        SELECT
            date(ended_at/1000, 'unixepoch') AS day,
            COUNT(*)                          AS plays,
            COALESCE(AVG(final_score), 0)     AS avg_score,
            COALESCE(MAX(final_score), 0)     AS max_score
        FROM plays
        WHERE ended_at >= ?
        GROUP BY day
        ORDER BY day
    `),
    scoreHistogram: db.prepare(`
        SELECT
            (final_score / 50) * 50 AS bucket,
            COUNT(*)                AS c
        FROM plays
        GROUP BY bucket
        ORDER BY bucket
    `),
    stageHistogram: db.prepare(`
        SELECT
            max_stage AS stage,
            COUNT(*)  AS c
        FROM plays
        GROUP BY stage
        ORDER BY stage
    `),
};

module.exports = {
    insertPlay:    (data)        => stmt.insert.run(data),
    topByScore:    (n = 10)      => stmt.topByScore.all(n),
    topByStage:    (n = 10)      => stmt.topByStage.all(n),
    overview:      ()            => stmt.overview.get(),
    topIPs:        (n = 10)      => stmt.topIPs.all(n),
    playsPerDay:   (sinceMs)     => stmt.playsPerDay.all(sinceMs),
    scoreHistogram:()            => stmt.scoreHistogram.all(),
    stageHistogram:()            => stmt.stageHistogram.all(),
};
