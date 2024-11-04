const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// 현재 파일의 디렉토리 경로
const currentDirectory = path.dirname(path.resolve(__filename));

// CSV 파일 디렉토리 및 파일명 설정
const csvDirectory = path.join(currentDirectory, "../../");

function readUUIDFromCSV(csvDirectory, csvFilename) {
    const uuids = [];
    const csvPath = path.join(csvDirectory, csvFilename);

    if (!fs.existsSync(csvPath)) {
        return uuids;
    }

    const fileStream = fs.createReadStream(csvPath).pipe(csv());

    return new Promise((resolve, reject) => {
        fileStream
            .on('data', (row) => {
                uuids.push(row.id);  // UUID 컬럼에 해당하는 데이터 추출
            })
            .on('end', () => {
                resolve(uuids);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// UUID 데이터를 저장할 자료구조 초기화
const readUUIDs = async () => {
    const userUUIDs = await readUUIDFromCSV(csvDirectory, "user.csv");
    const storeUUIDs = await readUUIDFromCSV(csvDirectory, "store.csv");
    const itemUUIDs = await readUUIDFromCSV(csvDirectory, "item.csv");
    const orderUUIDs = await readUUIDFromCSV(csvDirectory, "order.csv");

    // console.log('User UUIDs:', userUUIDs);
    // console.log('Store UUIDs:', storeUUIDs);
    // console.log('Item UUIDs:', itemUUIDs);
    // console.log('Order UUIDs:', orderUUIDs);

    return {
        userUUIDs,
        storeUUIDs,
        itemUUIDs,
        orderUUIDs,
    };
};

// readUUIDs();

module.exports = readUUIDs;
