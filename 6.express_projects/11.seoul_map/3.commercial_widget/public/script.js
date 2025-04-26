// 전역 변수로 map 선언하여 chatbot.js에서 접근 가능하게 함
const map = L.map('map').setView([37.5665, 126.978], 12); // 기본 서울

let geoLayer = null;
let legend = null; // 범례 전역 변수
let currentDataType = null; // 현재 활성화된 데이터 타입
let currentRegion = 'seoul'; // 현재 선택된 지역

// 외부에서 접근 가능하도록 window 객체에 현재 데이터 타입 설정
window.currentDataType = currentDataType;

const regionInfo = {
    seoul: {
        title: '서울특별시 행정동 경계',
        center: [37.5665, 126.978], // 서울시청 중심
        zoom: 12,
    },
    jeju: {
        title: '제주특별자치도 행정동 경계',
        // center: [33.4996, 126.5312], // 제주시청 중심
        center: [33.3617, 126.5292],  // 한라산 중심
        zoom: 11,
    }
};

// 데이터 시각화 정보
const dataInfo = {
    sales: {
        title: '총 매출 금액',
        description: '상권별 매출 총액을 나타냅니다.',
        colorScale: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026']
    },
    time: {
        title: '저녁 시간대 매출 (17-21시)',
        description: '17-21시 사이의 매출을 나타냅니다.',
        colorScale: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594']
    },
    gender: {
        title: '성별 매출 비율 (남성)',
        description: '남성 대 여성 매출의 비율을 나타냅니다 (남성 비율).',
        colorScale: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b']
    },
    age: {
        title: '20-30대 매출',
        description: '20-30대 연령층의 매출을 나타냅니다.',
        colorScale: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84']
    },
    type: {
        title: '업종 다양성',
        description: '상권내 존재하는 서비스 업종 수를 나타냅니다.',
        colorScale: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000']
    },
    weekday: {
        title: '주중/주말 총 매출',
        description: '주중과 주말의 총 매출을 나타냅니다.',
        colorScale: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32']
    }
};

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const regionSelector = document.getElementById('region-selector');
regionSelector.addEventListener('change', () => {
    const selected = regionSelector.value;
    currentRegion = selected;
    updateRegion(selected);
});

// 데이터 시각화 버튼 클릭 핸들러
function onClickDataButton(type) {
    // 이미 선택된 버튼이면 토글 해제
    if (currentDataType === type) {
        currentDataType = null;
        window.currentDataType = null;
        
        // 버튼 활성화 상태 제거
        document.querySelectorAll('#control-panel button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 일반 GeoJSON으로 돌아가기
        updateRegion(currentRegion);
        
        // 범례 제거
        if (legend) {
            map.removeControl(legend);
            legend = null;
        }
        
        return;
    }
    
    currentDataType = type;
    window.currentDataType = type;
    
    // 버튼 활성화 상태 업데이트
    document.querySelectorAll('#control-panel button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeButton = document.querySelector(`button[onclick="onClickDataButton('${type}')"]`);
    if (activeButton) activeButton.classList.add('active');
    
    // 데이터 로드 및 시각화
    loadDataAndVisualize(type);
}

// 데이터 로드 및 시각화 함수
function loadDataAndVisualize(type) {
    // 수정된 API 엔드포인트를 사용
    fetch(`/api/data/${currentRegion}/${type}`)
        .then(res => res.json())
        .then(data => {
            // 이전 레이어 제거
            if (geoLayer) {
                map.removeLayer(geoLayer);
            }
            
            // 값의 범위 구하기
            const values = data.features
                .map(f => f.properties.value)
                .filter(v => v !== undefined && v !== null && v !== 0);  // 0값 제외
            
            // 디버깅용 로그 추가
            console.log(`데이터 타입: ${type}, 값 개수: ${values.length}`);
            console.log(`최소값: ${Math.min(...values)}, 최대값: ${Math.max(...values)}`);
            
            // 모든 값이 같은 경우 처리
            const min = values.length > 0 ? Math.min(...values) : 0;
            const max = values.length > 0 ? Math.max(...values) : 1;
            
            // 색상 스케일 함수 생성
            const getColor = (value) => {
                if (value === undefined || value === null || value === 0) return '#f0f0f0';
                
                const scale = dataInfo[type].colorScale;
                const steps = scale.length;
                
                // 최소값과 최대값이 같거나 유효하지 않은 경우
                if (min >= max || values.length === 0) {
                    return scale[0]; // 기본 색상 반환
                }
                
                const range = max - min;
                const step = range / steps;
                
                // 값에 따른 색상 결정
                for (let i = 0; i < steps; i++) {
                    if (value <= min + step * (i + 1)) {
                        return scale[i];
                    }
                }
                return scale[scale.length - 1];
            };
            
            // GeoJSON 레이어 생성
            geoLayer = L.geoJSON(data, {
                style: feature => {
                    const value = feature.properties.value;
                    return {
                        fillColor: getColor(value),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: (feature, layer) => {
                    const props = feature.properties;
                    const formattedValue = type === 'gender' 
                        ? `${props.value.toFixed(1)}%` 
                        : formatNumber(props.value);
                    
                    const popupContent = `
                        <strong>${props.adm_nm || '이름 없음'}</strong><br>
                        ${dataInfo[type].title}: ${formattedValue}<br>
                        행정동코드: ${props.adm_cd || '-'}<br>
                    `;
                    
                    layer.bindPopup(popupContent);
                    
                    // 마우스 이벤트
                    layer.on({
                        mouseover: e => {
                            const layer = e.target;
                            layer.setStyle({
                                weight: 3,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.9
                            });
                            layer.bringToFront();
                            
                            layer.bindTooltip(`${props.adm_nm}: ${formattedValue}`).openTooltip();
                        },
                        mouseout: e => {
                            geoLayer.resetStyle(e.target);
                        },
                        click: e => {
                            map.fitBounds(e.target.getBounds());
                            
                            const { lat, lng } = e.latlng;
                            console.log(`📌 행정동 클릭: ${props.adm_nm} / 위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`);
                        }
                    });
                }
            }).addTo(map);

            // 범례 추가
            if (legend) {
                map.removeControl(legend);
            }
            
            // 레전드 생성
            legend = L.control({ position: 'bottomright' });
            legend.onAdd = function(map) {
                // 레전드 DOM 생성 시 특별한 클래스 추가 (CSS로 위치 조정 가능)
                const div = L.DomUtil.create('div', 'info legend chat-legend');
                let grades = [];
                
                // 데이터 타입별 고정 범위 설정
                switch(type) {
                    case 'sales':
                        if (currentRegion === 'seoul') {
                            // 서울: 총매출 - 1억 단위로 표시
                            grades = [0, 100000000, 200000000, 300000000, 400000000, 500000000, 700000000, 900000000];
                        } else { // jeju
                            // 제주: 총매출 - 100만 단위로 표시 (서울의 1/100)
                            grades = [0, 1000000, 2000000, 3000000, 4000000, 5000000, 7000000, 9000000];
                        }
                        break;
                    case 'time':
                        if (currentRegion === 'seoul') {
                            // 서울: 시간대 - 5천만 단위로 표시
                            grades = [0, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000];
                        } else { // jeju
                            // 제주: 시간대 - 50만 단위로 표시 (서울의 1/100)
                            grades = [0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000];
                        }
                        break;
                    case 'gender':
                        // 성별: 5% 단위로 표시 (남성 비율) - 지역 무관
                        grades = [30, 35, 40, 45, 50, 55, 60, 65, 70];
                        break;
                    case 'age':
                        // 연령: 3천만 단위로 표시 - 지역 무관
                        grades = [0, 30000000, 60000000, 90000000, 120000000, 150000000, 180000000];
                        break;
                    case 'type':
                        // 업종: 5개 단위로 표시 - 지역 무관
                        grades = [0, 5, 10, 15, 20, 30, 40, 50];
                        break;
                    case 'weekday':
                        if (currentRegion === 'seoul') {
                            // 서울: 요일 - 5천만 단위로 표시
                            grades = [0, 50000000, 100000000, 150000000, 200000000, 300000000, 400000000, 500000000];
                        } else { // jeju
                            // 제주: 요일 - 50만 단위로 표시 (서울의 1/100)
                            grades = [0, 500000, 1000000, 1500000, 2000000, 3000000, 4000000, 5000000];
                        }
                        break;
                    default:
                        // 데이터에 따른 등분 계산 (기존 코드)
                        for (let i = 0; i < 7; i++) {
                            grades.push(min + (max - min) * i / 7);
                        }
                }
                
                // 범례 제목
                div.innerHTML = `<h4>${dataInfo[type].title}</h4>`;
                
                // 색상 박스와 레이블
                for (let i = 0; i < grades.length - 1; i++) {
                    const formattedStart = type === 'gender' ? `${grades[i]}%` : formatNumber(grades[i]);
                    const formattedEnd = type === 'gender' ? `${grades[i+1]}%` : formatNumber(grades[i+1]);
                    
                    div.innerHTML +=
                        `<i style="background:${dataInfo[type].colorScale[i]}"></i> ${formattedStart} &ndash; ${formattedEnd}<br>`;
                }
                
                return div;
            };
            
            legend.addTo(map);
            
            // 숫자 포맷팅 함수 (천 단위 구분)
            function formatNumber(num) {
                if (num >= 100000000) {
                    return (num / 100000000).toFixed(1) + '억';
                } else if (num >= 10000) {
                    return (num / 10000).toFixed(0) + '만';
                } else {
                    return num.toLocaleString();
                }
            }
            
            // 제목 업데이트
            const regionName = currentRegion === 'seoul' ? '서울특별시' : '제주특별자치도';
            document.getElementById('map-title').textContent = `${regionName} 행정동별 ${dataInfo[type].title}`;
        })
        .catch(error => {
            console.error('데이터 로드 오류:', error);
            alert('데이터를 불러오는데 실패했습니다.');
        });
}

function updateRegion(region) {
    const info = regionInfo[region];
    if (!info) return;

    // 지도 중심 이동
    map.setView(info.center, info.zoom);

    // 제목 변경
    document.getElementById('map-title').textContent = info.title;

    // 이전 레이어 제거
    if (geoLayer) {
        map.removeLayer(geoLayer);
    }
    
    // 범례 제거
    if (legend) {
        map.removeControl(legend);
        legend = null;
    }

    // 데이터 시각화 활성화된 상태라면 데이터 다시 로드
    if (currentDataType) {
        loadDataAndVisualize(currentDataType);
        return;
    }

    // 새 geojson 불러오기 - 수정된 API 엔드포인트 사용
    const endpoint = `/api/geojson/${region}`;
        
    fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
            geoLayer = L.geoJSON(data, {
                style: {
                    color: '#2a5db0',
                    weight: 1.5,
                    fillColor: '#a0c8f0',
                    fillOpacity: 0.5,
                },
                onEachFeature: function (feature, layer) {
                    const props = feature.properties;
                    const popupContent = `
                        <strong>${props.adm_nm || '이름 없음'}</strong><br>
                        행정동코드: ${props.adm_cd || '-'}<br>
                        구: ${props.sggnm || '-'}<br>
                        시도: ${props.sidonm || '-'}
                    `;
                    layer.bindPopup(popupContent);

                    // 👇 클릭 좌표도 추가로 콘솔에 출력
                    layer.on('click', function (e) {
                        const { lat, lng } = e.latlng;
                        console.log(`📌 행정동 클릭: ${props.adm_nm} / 위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`);
                    });
                }
            }).addTo(map);
        });
}

// 👇 리전 외 클릭 좌표도 콘솔에 출력
map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    console.log(`🗺️ 클릭한 위치 위도: ${lat.toFixed(6)}, 경도: ${lng.toFixed(6)}`);
});

// 초기 로딩: 서울
updateRegion('seoul');

// map 변수를 전역 범위에 노출 (챗봇에서 사용하기 위함)
window.map = map;
