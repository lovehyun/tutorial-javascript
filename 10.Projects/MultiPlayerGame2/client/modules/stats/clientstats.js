const clientStatsContainer = document.getElementById('clientStatsContainer');

fetch('/api/clients/stats')
    .then(response => response.json())
    .then(data => {
        const stats = data;

        // 데이터 추출
        const labels = stats.map(client => client.IP);
        const connections = stats.map(client => client.totalConnections);
        const sessionCounts = stats.map(client => client.sessions.length);
        const scores = [];

        for (let i = 0; i < sessionCounts.length; i++) {
            for (let j = 0; j < sessionCounts[i]; j++) {
                const score = stats[i].sessions[j].score;
                scores.push(score !== null ? score : 0);
            }
        }

        const scores_map = scores.map((score, index) => ({ x: index + 1, y: score }));

        console.log("connections: ", connections);
        console.log("scores_map: ", sessionCounts, scores, scores_map);

        // 차트 생성
        let ctx = document.getElementById('clientStatsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'IP Address', // x 축 제목 변경
                        data: connections,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // 막대 색상
                        borderColor: 'rgba(75, 192, 192, 1)', // 막대 테두리 색상
                        borderWidth: 1 // 막대 테두리 두께
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true, // 반응형 크기 조정
                scales: {
                    x: {
                        beginAtZero: true, // x 축 값 0부터 시작
                        title: {
                            display: true,
                            text: 'Total Connections' // x 축 제목 변경
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'IP Address' // y 축 제목 변경
                        }
                    }
                },
                barThickness: 20 // 바의 폭 조절
            }
        });

        // 차트 생성
        ctx = document.getElementById('clientScoreChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: labels,
                        data: scores_map,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
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
                        type: 'linear', // 선형 스케일링 활성화
                        title: {
                            display: true,
                            text: 'Game Round'
                        }
                    }
                }
            }
        });
    })

    .catch(error => {
        console.error('오류:', error);
        clientStatsContainer.textContent = '클라이언트 통계를 가져오는 동안 오류가 발생했습니다.';
    });
