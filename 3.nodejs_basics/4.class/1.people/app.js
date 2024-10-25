const Employee = require('./Employee');
const Student = require('./Student');

const employee = new Employee("영희", "매니저");
const student = new Student("철수", "컴퓨터 공학");

employee.greet();
student.greet();
