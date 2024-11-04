// main.js
const NameGenerator = require('./generators/NameGenerator');
const BirthdateGenerator = require('./generators/BirthdateGenerator');
const GenderGenerator = require('./generators/GenderGenerator');
const AddressGenerator = require('./generators/AddressGenerator');

const name_gen = new NameGenerator();
const name = name_gen.generate();

const birthdate_gen = new BirthdateGenerator();
const birthdate = birthdate_gen.generate();

const gender_gen = new GenderGenerator();
const gender = gender_gen.generate();

const address_gen = new AddressGenerator();
const address = address_gen.generate();

console.log(`Name: ${name}`);
console.log(`Birthdate: ${birthdate}`);
console.log(`Gender: ${gender}`);
console.log(`Address: ${address}`);
