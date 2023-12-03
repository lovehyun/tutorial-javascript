const clientStatsContainer = document.getElementById('clientStatsContainer');

// 차트 생성 함수
function createConnectionBarChart(data) {
    const ctx = document.getElementById('clientStatsChart').getContext('2d');

    const labels = [];

    // 챠트 정보 생성 - ClientIP 추출
    data.forEach(client => {
        labels.push(client.IP);
    });

    const dataset_data = data.map(client => client.totalConnections);

    const chart_data = {
        labels: labels,
        datasets: [
            {
                label: 'IP Address',
                data: dataset_data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const chart_options = {
        indexAxis: 'y',
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Total Connections'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'IP Address'
                }
            }
        },
        barThickness: 20
    }

    new Chart(ctx, {
        type: 'bar',
        data: chart_data,
        options: chart_options,
    });
}

// 차트 생성 함수
function createScoreLineChart(data) {
    const ctx = document.getElementById('clientScoreChart').getContext('2d');

    const labels = [];
    const scores_map = [];

    // 챠트 정보 생성
    data.forEach((client) => {
        const scores = client.sessions.map(session => session.score !== null ? session.score : 0);
        labels.push(client.IP);
        scores_map.push(scores);
    });

    // 차트 스코어 데이터 생성
    const datasets = scores_map.map((scores, index) => ({
        label: labels[index],
        data: scores,
        backgroundColor: `rgba(75, 192, 192, ${0.2 + (index * 0.1)})`,
        borderColor: `rgba(75, 192, 192, 1)`,
        borderWidth: 1
    }));

    const chart_data = {
        labels: Array.from({ length: scores_map[0].length }, (_, i) => i + 1),
        datasets: datasets
    };

    const chart_options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score'
                }
            },
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Game Round'
                },
                ticks: {
                    stepSize: 1.0
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'line',
        data: chart_data,
        options: chart_options,
    });
}

fetch('/api/clients/stats')
    .then(response => response.json())
    .then(data => {
        // 차트 생성 함수 호출
        createConnectionBarChart(data);
        createScoreLineChart(data);
    })
    .catch(error => {
        console.error('오류:', error);
        clientStatsContainer.textContent = '클라이언트 통계를 가져오는 동안 오류가 발생했습니다.';
    });
