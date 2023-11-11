const UserGenerator = require('./generators/user/UserGenerator');
const StoreGenerator = require('./generators/store/StoreGenerator');
const ItemGenerator = require('./generators/item/ItemGenerator');
const OrderGenerator = require('./generators/order/OrderGenerator');
const OrderItemGenerator = require('./generators/order/OrderItemGenerator');
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

async function main() {
    if (process.argv.length === 5) {
        const dataType = process.argv[2].toLowerCase();
        const numRecords = parseInt(process.argv[3]);
        const outputFormat = process.argv[4].toLowerCase();

        let data;

        switch (dataType) {
            case "user":
                const userGen = new UserGenerator();
                data = userGen.generateUsers(numRecords);
                break;
            case "store":
                const storeGen = new StoreGenerator();
                data = storeGen.generateStores(numRecords);
                break;
            case "item":
                const itemGen = new ItemGenerator();
                data = itemGen.generateItems(numRecords);
                break;
            case "order":
                const orderGen = new OrderGenerator();
                await orderGen.init();
                data = orderGen.generateOrders(numRecords);
                break;
            case "orderitem":
                const orderitemGen = new OrderItemGenerator();
                await orderitemGen.init();
                data = orderitemGen.generateOrderItems(numRecords);
                break;
            default:
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
}

main()
// quickTest()
