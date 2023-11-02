class NameGenerator {
    constructor() {
        this.names = ['John', 'Jane', 'Michael', 'Emily', 'William', 'Olivia'];
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
    constructor() {
        this.cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'];
    }

    generateAddress() {
        const city = this.cities[Math.floor(Math.random() * this.cities.length)];
        const street = Math.floor(Math.random() * 100) + 1;
        return `${street} ${city}`;
    }
}

class DataGenerator {
    constructor() {
        this.nameGen = new NameGenerator();
        this.birthdateGen = new BirthdateGenerator();
        this.genderGen = new GenderGenerator();
        this.addressGen = new AddressGenerator();
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

class DataPrinter extends DataGenerator {
    printData(count) {
        const data = this.generateData(count);
        for (const [name, birthdate, gender, address] of data) {
            console.log(`Name: ${name}\nBirthdate: ${birthdate}\nGender: ${gender}\nAddress: ${address}\n`);
        }
    }
}

// 프로그램 실행
const printer = new DataPrinter();

// 데이터 출력
printer.printData(100); // 100개의 데이터 출력
