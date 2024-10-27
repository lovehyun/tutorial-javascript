// app.js
const { Electronics, Clothing, Grocery } = require('./shop/Product');
const Order = require('./shop/Order');
const User = require('./shop/User');

// 사용자 생성
const user = new User('Alice', 'alice@example.com', '123 Main St');

// 상품 생성
const laptop = new Electronics('Laptop', 1200, 5, '2 years');
const tshirt = new Clothing('T-shirt', 20, 100, 'M');
const milk = new Grocery('Milk', 2, 50, '2023-12-31');

// 주문 생성 및 상품 추가
const order1 = new Order(user);
order1.addProduct(laptop, 1);
order1.addProduct(tshirt, 2);
order1.addProduct(milk, 3);

// 주문을 사용자 주문 기록에 추가
user.addOrder(order1);

// 주문 요약 출력
console.log("Order Summary:", order1.getOrderSummary());
// console.log("Order Summary:", JSON.stringify(order1.getOrderSummary(), null, 2));

// 사용자 주문 기록 출력
console.log("User Order History:", user.getOrderHistory());
// console.log("User Order History:", JSON.stringify(user.getOrderHistory(), null, 2));
