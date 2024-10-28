const fs = require('fs');

class NameGenerator {
    constructor(file_path) {
        this.names = this.load_data(file_path);
    }

    load_data(file_path) {
        const data = fs.readFileSync(file_path, 'utf8').split('\r\n');
        return data;
    }

    generateName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }
}

class BirthdateGenerator {
    generateBirthdate() {
        const year = Math.floor(Math.random() * (2005 - 1970 + 1)) + 1970;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
}

class GenderGenerator {
    generateGender() {
        return Math.random() < 0.5 ? 'Male' : 'Female';
    }
}

class AddressGenerator {
    constructor(file_path) {
        this.cities = this.load_data(file_path);
    }

    load_data(file_path) {
        const data = fs.readFileSync(file_path, 'utf8').split('\r\n');
        return data;
    }

    generateAddress() {
        const city = this.cities[Math.floor(Math.random() * this.cities.length)];
        const street = Math.floor(Math.random() * 100) + 1;
        return `${street} ${city}`;
    }
}

class UserGenerator {
    constructor(name_file, city_file) {
        this.nameGen = new NameGenerator(name_file);
        this.birthdateGen = new BirthdateGenerator();
        this.genderGen = new GenderGenerator();
        this.addressGen = new AddressGenerator(city_file);
    }

    generateData(count) {
        const data = [];
        for (let i = 0; i < count; i++) {
            const name = this.nameGen.generateName();
            const birthdate = this.birthdateGen.generateBirthdate();
            const gender = this.genderGen.generateGender();
            const address = this.addressGen.generateAddress();
            data.push([name, birthdate, gender, address]);
        }
        return data;
    }
}

class DataPrinter {
    constructor(data) {
        this.data = data;
    }

    printData() {
        for (const [name, birthdate, gender, address] of this.data) {
            console.log(`Name: ${name}\nBirthdate: ${birthdate}\nGender: ${gender}\nAddress: ${address}\n`);
        }
    }

    saveToFile(filename) {
        // https://www.npmjs.com/package/csv-writer
        const csvWriter = require('csv-writer').createObjectCsvWriter;

        const csv = csvWriter({
            path: filename,
            header: [
                { id: 'Name', title: 'Name' },
                { id: 'Birthdate', title: 'Birthdate' },
                { id: 'Gender', title: 'Gender' },
                { id: 'Address', title: 'Address' }
            ]
        });

        const records = this.data.map(([name, birthdate, gender, address]) => ({
            Name: name,
            Birthdate: birthdate,
            Gender: gender,
            Address: address
        }));

        csv.writeRecords(records)
            .then(() => console.log(`CSV file ${filename} has been written successfully`))
            .catch((err) => console.error(err));
    }
}

// 프로그램 실행
const nameFile = 'names.txt';  // 이름 데이터 파일 경로
const cityFile = 'cities.txt';  // 도시 데이터 파일 경로

const userGenerator = new UserGenerator(nameFile, cityFile);
const users = userGenerator.generateData(10);
const printer = new DataPrinter(users);

// 출력 (화면 or CSV 파일로 저장)
printer.printData();
printer.saveToFile('data.csv');  // 100개의 데이터를 'data.csv' 파일로 저장
