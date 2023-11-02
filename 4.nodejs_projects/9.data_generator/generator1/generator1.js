const names = ['John', 'Jane', 'Michael', 'Emily', 'William', 'Olivia'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia'];

function generateName() {
    return names[Math.floor(Math.random() * names.length)];
}

function generateBirthdate() {
    const year = Math.floor(Math.random() * (2005 - 1970 + 1)) + 1970;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function generateGender() {
    return Math.random() < 0.5 ? 'Male' : 'Female';
}

function generateAddress() {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const street = Math.floor(Math.random() * 100) + 1;
    return `${street} ${city}`;
}

const data = [];
for (let i = 0; i < 10; i++) {
    const name = generateName();
    const birthdate = generateBirthdate();
    const gender = generateGender();
    const address = generateAddress();
    data.push([name, birthdate, gender, address]);
}

for (const d of data) {
    console.log(d);
}
