let clientKey; // Toss Payments 클라이언트 키
let customerKey; // 고객 고유 키
let tossPayments; // Toss Payments 객체
let payment; // 결제 객체

let selectedProduct = null; // 선택된 상품
let selectedPaymentMethod = null; // 선택된 결제 수단

// 클라이언트 키를 가져오고 Toss Payments 초기화
async function initializePayments() {
    try {
        clientKey = await fetchClientKey(); // 클라이언트 키 가져오기
        customerKey = generateRandomString(); // 고객 고유 키 생성
        tossPayments = TossPayments(clientKey); // Toss Payments 초기화
        payment = tossPayments.payment({ customerKey }); // 결제 초기화
        console.log("Toss Payments initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize Toss Payments:", error);
        alert("결제 시스템 초기화에 실패했습니다.");
    }
}

// 클라이언트 키를 가져오는 함수
async function fetchClientKey() {
    const response = await fetch('/config');
    const data = await response.json();
    return data.clientKey;
}

// 상품 선택
function selectProduct(event, name, price) {
    selectedProduct = { name, price };
    document.querySelectorAll(".product-button").forEach((button) => {
        button.style.backgroundColor = "#ffffff";
    });
    event.target.style.backgroundColor = "rgb(229 239 255)";
}

// 결제 수단 선택
function selectPaymentMethod(method) {
    if (selectedPaymentMethod) {
        document.getElementById(selectedPaymentMethod).style.backgroundColor = "#ffffff";
    }
    selectedPaymentMethod = method;
    document.getElementById(selectedPaymentMethod).style.backgroundColor = "rgb(229 239 255)";
}

// 결제 요청
async function requestPayment() {
    if (!selectedProduct) {
        alert("상품을 선택해주세요.");
        return;
    }
    if (!selectedPaymentMethod) {
        alert("결제 수단을 선택해주세요.");
        return;
    }

    const { name, price } = selectedProduct;
    const orderId = generateRandomString(); // 주문 ID 생성

    try {
        // Toss 결제창 띄우기
        await payment.requestPayment({
            method: selectedPaymentMethod,
            amount: { currency: "KRW", value: price },
            orderId: orderId,
            orderName: name,
            successUrl: `${window.location.origin}/success.html`,
            failUrl: `${window.location.origin}/fail.html`,
        });
    } catch (error) {
        alert(`결제 요청 중 오류가 발생했습니다: ${error.message}`);
    }
}

// 랜덤 문자열 생성
function generateRandomString() {
    return Math.random().toString(36).slice(2, 10); // 36진수(0-9a-z) 13자리 중 2~10까지 8자리
}

// 페이지 로드 시 Toss Payments 초기화
document.addEventListener("DOMContentLoaded", () => {
    initializePayments(); // 초기화 함수 호출
});
