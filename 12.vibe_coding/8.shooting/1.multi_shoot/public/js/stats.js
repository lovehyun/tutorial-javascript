(function () {
    const base = window.MultiShoot.basePath();

    fetch(base + 'api/stats')
        .then(r => r.json())
        .then(render)
        .catch(e => {
            document.body.insertAdjacentHTML('beforeend', `<p class="red">통계 로드 실패: ${e.message}</p>`);
        });

    function render(data) {
        renderOverview(data.overview);
        renderTopIPs(data.topIPs);
        renderPlaysPerDay(data.playsPerDay);
        renderScoreHistogram(data.scoreHistogram);
        renderStageHistogram(data.stageHistogram);
    }

    function renderOverview(ov) {
        const m = (label, value, cls) =>
            `<div class="metric"><div class="label">${label}</div><div class="value ${cls || ''}">${value}</div></div>`;

        document.getElementById('dash-overview').innerHTML = `
            ${m('총 플레이 수',    ov.totalPlays,      'blue')}
            ${m('고유 IP 수',      ov.uniqueIPs,       'green')}
            ${m('평균 점수',       ov.avgScore,        '')}
            ${m('역대 최고 점수',  ov.maxScore,        'gold')}
            ${m('평균 도달 스테이지', ov.avgStage,    '')}
            ${m('역대 최고 스테이지', ov.topStage,    'red')}
            ${m('전체 명중률',     ov.accuracy + '%',  'green')}
            ${m('평균 플레이 시간', ov.avgDurationS + 's', '')}
        `;
    }

    function renderTopIPs(ips) {
        const tbody = ips.map(r => `
            <tr>
                <td>${r.ip}</td>
                <td class="num">${r.plays}</td>
                <td class="num">${r.best_score}</td>
                <td class="num">${r.best_stage}</td>
                <td class="num">${r.total_score}</td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="muted">데이터 없음</td></tr>';

        document.getElementById('dash-ips').innerHTML = `
            <table class="stat-table">
                <thead>
                    <tr>
                        <th>IP</th>
                        <th class="num">플레이</th>
                        <th class="num">최고점</th>
                        <th class="num">최고 스테이지</th>
                        <th class="num">총 점수</th>
                    </tr>
                </thead>
                <tbody>${tbody}</tbody>
            </table>
        `;
    }

    function renderPlaysPerDay(rows) {
        if (!rows.length) {
            document.getElementById('dash-days').innerHTML = '<p class="muted">데이터 없음</p>';
            return;
        }
        const max = Math.max(...rows.map(r => r.plays));
        const html = rows.map(r => {
            const pct = max ? (r.plays / max) * 100 : 0;
            return `
                <div class="bar-row">
                    <span class="label">${r.day.slice(5)}</span>
                    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
                    <span class="num">${r.plays}</span>
                </div>
            `;
        }).join('');
        document.getElementById('dash-days').innerHTML = `<div class="bars">${html}</div>`;
    }

    function renderScoreHistogram(rows) {
        if (!rows.length) {
            document.getElementById('dash-scores').innerHTML = '<p class="muted">데이터 없음</p>';
            return;
        }
        const max = Math.max(...rows.map(r => r.c));
        const html = rows.map(r => {
            const pct = max ? (r.c / max) * 100 : 0;
            return `
                <div class="bar-row">
                    <span class="label">${r.bucket}~${r.bucket + 49}</span>
                    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
                    <span class="num">${r.c}</span>
                </div>
            `;
        }).join('');
        document.getElementById('dash-scores').innerHTML = `<div class="bars">${html}</div>`;
    }

    function renderStageHistogram(rows) {
        if (!rows.length) {
            document.getElementById('dash-stages').innerHTML = '<p class="muted">데이터 없음</p>';
            return;
        }
        const max = Math.max(...rows.map(r => r.c));
        const html = rows.map(r => {
            const pct = max ? (r.c / max) * 100 : 0;
            return `
                <div class="bar-row">
                    <span class="label">Stage ${r.stage}</span>
                    <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
                    <span class="num">${r.c}</span>
                </div>
            `;
        }).join('');
        document.getElementById('dash-stages').innerHTML = `<div class="bars">${html}</div>`;
    }
})();
