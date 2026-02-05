const clientKey = "test_ck_xxxxxxxxxx"; // Toss Payments 클라이언트 키
const customerKey = generateRandomString(); // 고객 고유 키
const tossPayments = TossPayments(clientKey); // Toss Payments 초기화
const payment = tossPayments.payment({ customerKey }); // 결제 초기화

let selectedProduct = null;
let selectedPaymentMethod = null;

// 상품 선택
function selectProduct(event, name, price) {
    selectedProduct = { name, price };
    document.querySelectorAll(".product-button").forEach(button => {
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
            successUrl: `${window.location.origin}/success`, // 바로 ${window.location.origin}/success.html 을 호출해도 무방
            failUrl: `${window.location.origin}/fail`,       // 바로 ${window.location.origin}/fail.html 을 호출해도 무방
        });
    } catch (error) {
        alert(`결제 요청 중 오류가 발생했습니다: ${error.message}`);
    }
}

// 랜덤 문자열 생성
function generateRandomString() {
    return Math.random().toString(36).slice(2, 10); // 36진수(0-9a-z) 13자리 중 2~10까지 8자리
}
