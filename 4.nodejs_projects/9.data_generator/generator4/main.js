const fs = require('fs');
const NameGenerator = require('./generators/NameGenerator');
const BirthdateGenerator = require('./generators/BirthdateGenerator');
const GenderGenerator = require('./generators/GenderGenerator');
const AddressGenerator = require('./generators/AddressGenerator');

function generateData(numRecords) {
    const nameGen = new NameGenerator();
    const birthdateGen = new BirthdateGenerator();
    const genderGen = new GenderGenerator();
    const addressGen = new AddressGenerator();

    const data = [];
    for (let i = 0; i < numRecords; i++) {
        const name = nameGen.generate();
        const birthdate = birthdateGen.generate();
        const gender = genderGen.generate();
        const address = addressGen.generate();

        data.push([name, birthdate, gender, address]);
    }

    return data;
}

function saveToCSV(data) {
    let csvContent = 'Name,Birthdate,Gender,Address\n';
    data.forEach((row) => {
        csvContent += row.join(',') + '\n';
    });

    fs.writeFileSync('output.csv', csvContent);
    console.log('Data has been saved to output.csv file');
}

function printToConsole(data) {
    data.forEach((row) => {
        console.log(`Name: ${row[0]}`);
        console.log(`Birthdate: ${row[1]}`);
        console.log(`Gender: ${row[2]}`);
        console.log(`Address: ${row[3]}\n`);
    });
}

function printToStdout(data) {
    data.forEach((row) => {
        console.log(row.join(', '));
    });
}

function main() {
    let numRecords = 10; // Default number of records
    let outputFormat = 'stdout'; // Default output format

    // Retrieve number of records from command line argument if available
    if (process.argv.length > 2) {
        numRecords = parseInt(process.argv[2]);
    }

    // Retrieve output format from command line argument if available
    if (process.argv.length > 3) {
        outputFormat = process.argv[3];
    }

    const generatedData = generateData(numRecords);

    if (outputFormat === 'console') {
        printToConsole(generatedData);
    } else if (outputFormat === 'csv') {
        saveToCSV(generatedData);
    } else {
        printToStdout(generatedData);
    }
}

main();
