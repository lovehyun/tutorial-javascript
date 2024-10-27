function repeatMessage() {
    console.log("이 메시지는 1초마다 반복됩니다.");
    setTimeout(repeatMessage, 1000);
}

repeatMessage();
