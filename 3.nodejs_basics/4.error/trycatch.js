try {
    // 예외가 발생할 수 있는 코드
    const result = someUndefinedVariable * 2;
    console.log(result); // 실행되지 않음 (위에서 예외가 발생하여 아래 catch 블록으로 이동)
} catch (error) {
    // 예외가 발생했을 때 처리할 코드
    console.error('예외가 발생했습니다:', error.message);
}
