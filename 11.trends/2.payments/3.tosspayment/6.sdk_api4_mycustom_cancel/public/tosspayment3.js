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

// 결제 내역 조회 (동기 — 조회 중 버튼 비활성화 + 테이블 영역에 로딩 표시)
async function loadPaymentHistory(days) {
    days = days || 7;
    var el = document.getElementById("payment-history");
    var btn3 = document.getElementById("btn-history-3");
    var btn7 = document.getElementById("btn-history-7");

    el.style.display = "block";
    el.innerHTML = "<div class='loading-box'><div class='loading-spinner'></div><p>거래 내역 조회 중... (최대 1~2분 소요될 수 있습니다)</p></div>";
    if (btn3) { btn3.disabled = true; }
    if (btn7) { btn7.disabled = true; }

    try {
        var res = await fetch("/api/transactions?days=" + days + "&limit=50");
        var data = await res.json();
    } catch (err) {
        el.innerHTML = "<p style='color: #c00;'>오류: " + err.message + "</p>";
        if (btn3) btn3.disabled = false;
        if (btn7) btn7.disabled = false;
        return;
    }

    if (btn3) btn3.disabled = false;
    if (btn7) btn7.disabled = false;

    if (!res.ok) {
        el.innerHTML = "<p style='color: #c00;'>조회 실패: " + (data.message || data.code || res.status) + "</p>";
        return;
    }

    var list = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
    if (list.length === 0) {
        el.innerHTML = "<p>해당 기간 결제 내역이 없습니다.</p>";
        return;
    }
    renderTransactionList(el, data);
}

// 상태 라벨 — 모든 상태 그대로 표시 (필터 없음)
var STATUS_LABELS = {
    DONE: "완료",
    CANCELED: "취소",
    PARTIAL_CANCELED: "부분취소",
    WAITING_FOR_DEPOSIT: "입금대기",
    EXPIRED: "만료",
    ABORTED: "실패",
    READY: "대기",
    IN_PROGRESS: "진행중"
};

function isCancelable(status) {
    return status === "DONE" || status === "PARTIAL_CANCELED";
}

function requestCancel(btnOrKey, orderId) {
    var paymentKey = typeof btnOrKey === "string" ? btnOrKey : (btnOrKey && btnOrKey.getAttribute ? btnOrKey.getAttribute("data-payment-key") : null);
    if (orderId == null && btnOrKey && btnOrKey.getAttribute) orderId = btnOrKey.getAttribute("data-order-id");
    if (!paymentKey) return;
    var resultBox = document.getElementById("payment-cancel-result");
    var resultBody = document.getElementById("payment-cancel-result-body");
    if (!resultBox || !resultBody) return;
    resultBox.style.display = "block";
    resultBody.innerHTML = resultBody.innerHTML + "<p><strong>[" + (orderId || paymentKey) + "]</strong> 취소 요청 중...</p>";

    fetch("/api/payments/" + encodeURIComponent(paymentKey) + "/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelReason: "결제 내역 화면에서 요청한 취소" })
    })
        .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, status: r.status, body: body }; }); })
        .then(function (res) {
            var last = resultBody.querySelector("p:last-child");
            if (last) last.textContent = "[" + (orderId || paymentKey) + "] ";
            var pre = document.createElement("pre");
            pre.style.marginTop = "4px";
            pre.style.background = "#f5f5f5";
            pre.style.padding = "8px";
            pre.style.fontSize = "12px";
            pre.style.whiteSpace = "pre-wrap";
            if (res.ok) {
                if (last) last.appendChild(document.createTextNode("취소 완료"));
                pre.textContent = JSON.stringify(res.body, null, 2);
            } else {
                if (last) last.appendChild(document.createTextNode("취소 실패: " + (res.body && res.body.message ? res.body.message : res.status)));
                pre.textContent = JSON.stringify(res.body, null, 2);
            }
            resultBody.appendChild(pre);
        })
        .catch(function (err) {
            var last = resultBody.querySelector("p:last-child");
            if (last) last.textContent = "[" + (orderId || paymentKey) + "] 오류: " + err.message;
        });
}

function renderTransactionList(el, data) {
    var list = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
    if (list.length === 0) {
        el.innerHTML = "<p>해당 기간 결제 내역이 없습니다.</p>";
        return;
    }
    list = list.slice().reverse();
    var html = "<table class='transaction-table'><thead><tr><th>거래일시</th><th>주문번호</th><th>결제수단</th><th>금액</th><th>상태</th><th>동작</th></tr></thead><tbody>";
    for (var i = 0; i < list.length; i++) {
        var t = list[i];
        var at = (t.transactionAt || "").replace("T", " ").slice(0, 19);
        var status = STATUS_LABELS[t.status] != null ? STATUS_LABELS[t.status] : (t.status || "-");
        var cancelBtn = "";
        if (isCancelable(t.status) && t.paymentKey) {
            var pk = (t.paymentKey + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var oid = ((t.orderId || "") + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            cancelBtn = "<button type='button' class='button2' data-payment-key=\"" + pk + "\" data-order-id=\"" + oid + "\" onclick=\"requestCancel(this)\">취소</button>";
        }
        html += "<tr><td>" + at + "</td><td>" + (t.orderId || "-") + "</td><td>" + (t.method || "-") + "</td><td>" + (t.amount ?? 0).toLocaleString() + "원</td><td>" + status + "</td><td>" + cancelBtn + "</td></tr>";
    }
    html += "</tbody></table>";
    el.innerHTML = html;
}

// 페이지 로드 시 Toss Payments 초기화
document.addEventListener("DOMContentLoaded", () => {
    initializePayments(); // 초기화 함수 호출
});
