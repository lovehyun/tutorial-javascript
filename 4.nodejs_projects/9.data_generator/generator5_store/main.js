const UserGenerator = require('./generators/user/UserGenerator');
const StoreGenerator = require('./generators/store/StoreGenerator');
const ItemGenerator = require('./generators/item/ItemGenerator');
const { saveToCsv, printToConsole, printToStdout } = require('./output/output');


function quickTest() {
    // User generation
    const userGen = new UserGenerator();
    const user = userGen.generate();
    console.log(user);

    // Store generation
    const storeGen = new StoreGenerator();
    const store = storeGen.generate();
    console.log(store);

    // Item generation
    const itemGen = new ItemGenerator();
    const item = itemGen.generate();
    console.log(item);
}

if (process.argv.length === 5) {
    const dataType = process.argv[2].toLowerCase();
    const numRecords = parseInt(process.argv[3]);
    const outputFormat = process.argv[4].toLowerCase();

    let data;

    if (dataType === "user") {
        const userGen = new UserGenerator();
        data = userGen.generateUsers(numRecords);
    } else if (dataType === "store") {
        const storeGen = new StoreGenerator();
        data = storeGen.generateStores(numRecords);
    } else if (dataType === "item") {
        const itemGen = new ItemGenerator();
        data = itemGen.generateItems(numRecords);
    } else {
        console.log("Unsupported data type.");
        process.exit(1);
    }

    if (outputFormat === "stdout") {
        printToStdout(data);
    } else if (outputFormat === "csv") {
        saveToCsv(data, dataType);
    } else if (outputFormat === "console") {
        printToConsole(data);
    } else {
        console.log("Unsupported output format.");
        process.exit(1);
    }
} else {
    console.log("Usage: node main.js <data_type> <num_records> <output_format>");
}

// quickTest()
