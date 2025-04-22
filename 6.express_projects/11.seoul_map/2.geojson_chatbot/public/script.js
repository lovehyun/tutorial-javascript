const map = L.map('map').setView([37.5665, 126.978], 12); // 기본 서울

let geoLayer = null;

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

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const regionSelector = document.getElementById('region-selector');
regionSelector.addEventListener('change', () => {
    const selected = regionSelector.value;
    updateRegion(selected);
});

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

    // 새 geojson 불러오기
    fetch(`/api/geojson/${region}`)
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
