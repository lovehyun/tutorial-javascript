// Counter 상태를 정의하는 인터페이스
interface CounterState {
    value: number;
  }
  
  // Counter 클래스
  class Counter2 implements CounterState {
    // private 필드와 readonly 키워드로 상태 관리
    private _value: number;
  
    constructor(initialValue: number = 0) {
      this._value = initialValue;
    }
  
    // Getter로 외부에서 읽기 가능
    get value(): number {
      return this._value;
    }
  
    // 메서드 타입 정의
    increment(): void {
      this._value += 1;
      console.log(`Counter: ${this._value}`);
    }
  
    decrement(): void {
      this._value -= 1;
      console.log(`Counter: ${this._value}`);
    }
  
    reset(): void {
      this._value = 0;
      console.log(`Counter reset. Current value: ${this._value}`);
    }
  }
  
  // Counter를 사용하는 함수
  const useCounter = (counter: Counter2): void => {
    counter.increment();
    counter.increment();
    counter.decrement();
    counter.reset();
  };
  
  // Counter 인스턴스 생성
//   const counter2: Counter = new Counter2(10); // 타입 추론으로 충분히 알 수 있음
  const counter2 = new Counter2(10); // 초기값 설정
  console.log(`Initial Counter Value: ${counter2.value}`);
  
  // Counter 활용
  useCounter(counter2);
  