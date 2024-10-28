class NameGenerator {
    constructor() {
        this.names = ['John', 'Jane', 'Michael', 'Emily', 'William', 'Olivia'];
    }

    generateName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }
}

/*
class MyUtil {
    static getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class BirthdateGenerator {
    generateBirthdate() {
        const year = MyUtil.getRandomInRange(1970, 2005);
        const month = MyUtil.getRandomInRange(1, 12);
        const day = MyUtil.getRandomInRange(1, 28); // 모든 달에 유효한 일로 제한
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
}
*/

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

class UserGenerator {
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

/* 상속 받아야 할까? 인자로 받아야 할까? */
class DataPrinter extends UserGenerator {
    printData(count) {
        const data = this.generateData(count);
        for (const [name, birthdate, gender, address] of data) {
            console.log(`Name: ${name}\nBirthdate: ${birthdate}\nGender: ${gender}\nAddress: ${address}\n`);
        }
    }
}

class DataPrinter2 {
    constructor(dataGenerator) {
        this.dataGenerator = dataGenerator; // DataGenerator 객체를 의존성으로 받음
    }

    generateAndPrintScreen(count) {
        const data = this.dataGenerator.generateData(count); // DataGenerator를 사용해 데이터 생성
        for (const [name, birthdate, gender, address] of data) {
            console.log(`Name: ${name}\nBirthdate: ${birthdate}\nGender: ${gender}\nAddress: ${address}\n`);
        }
    }
}

class DataPrinter3 {
    constructor(data) {
        this.data = data; // Data 객체를 의존성으로 받음
    }

    printScreen() {
        for (const [name, birthdate, gender, address] of this.data) {
            console.log(`Name: ${name}\nBirthdate: ${birthdate}\nGender: ${gender}\nAddress: ${address}\n`);
        }
    }
}


// 프로그램 실행
// 방법1. 상속
const printer = new DataPrinter();
printer.printData(10);
console.log('-'.repeat(40));


// 방법2. 객체 의존성 삽입
const userGenerator = new UserGenerator();
const printer2 = new DataPrinter2(userGenerator);

// 데이터 출력
printer2.generateAndPrintScreen(10); // 10개의 데이터 생성 및 출력
console.log('-'.repeat(40));


// 방법3. 생성된 데이터를 전달받아 출력
const users = userGenerator.generateData(10); // 10개의 데이터 생성
const printer3 = new DataPrinter3(users); // 해당 데이터 출력
printer3.printScreen();
