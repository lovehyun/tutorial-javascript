const fs = require('fs');

function saveToCsv(data, dataType) {
    let filename;

    switch (dataType) {
        case "user":
            filename = 'user.csv';
            break;
        case "store":
            filename = 'store.csv';
            break;
        case "item":
            filename = 'item.csv';
            break;
        case "order":
            filename = 'order.csv';
            break;
        case "orderitem":
            filename = 'orderitem.csv';
            break;
        default:
            console.log("Unsupported data type for CSV output.");
            process.exit(1);
    }

    const header = Object.keys(data[0]);
    const rows = data.map(item => Object.values(item));

    const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');

    fs.writeFileSync(filename, csvContent, { encoding: 'utf-8' });
    console.log(`Data saved to ${filename}`);
}

function printToConsole(data) {
    data.forEach(item => {
        if (item instanceof Object) {
            Object.entries(item).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
            console.log();
        } else {
            console.log(item);
        }
    });
}

function printToStdout(data) {
    console.log(JSON.stringify(data, null, 2));
}

module.exports = {
    saveToCsv,
    printToConsole,
    printToStdout
};
