// Feedback 타입 정의
type Feedback = 'Too low!' | 'Too high!' | 'Correct!';

// Feedback 메시지 상수
// Record<K, T>는 다음과 같이 동작합니다:
// K: 키의 타입 (일반적으로 string, number, symbol 또는 유니온 타입).
// T: 값의 타입.
const FEEDBACK_MESSAGES: Record<Feedback, string> = {
    'Too low!': 'Your guess is too low. Try again!',
    'Too high!': 'Your guess is too high. Try again!',
    'Correct!': 'You guessed it right!',
};

// guessNumber 함수 정의
function guessNumber2(target: number, guess: number): Feedback {
    if (guess < target) return 'Too low!';
    if (guess > target) return 'Too high!';
    return 'Correct!';
}

// 타겟 숫자 생성
const targetNumber2: number = Math.floor(Math.random() * 100) + 1;
console.log('Target Number:', targetNumber2);

// 사용자 추측 (실제 애플리케이션에서는 사용자 입력 대체)
const userGuess2: number = 50;

// 피드백 출력
const feedback2: Feedback = guessNumber2(targetNumber2, userGuess2);
console.log(FEEDBACK_MESSAGES[feedback2]);


// 참고: Record 의 일반적인 사용 사례
type StatusType = 'success' | 'error' | 'loading';
const messages: Record<StatusType, string> = {
    success: 'Operation completed successfully.',
    error: 'An error occurred during the operation.',
    loading: 'The operation is in progress.',
};

const userPermissions: Record<number, string> = {
    1: 'admin',
    2: 'editor',
    3: 'viewer',
};
