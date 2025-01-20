// src/geometry.ts

// TypeScript에서 모듈화 이전의 코드를 구성하는 방법으로 제공됩니다.
// 동일한 이름의 함수, 변수, 클래스 등을 이름 충돌 없이 하나의 네임스페이스 안에서 관리할 수 있게 해줍니다.
// JavaScript에서는 지원되지 않으며, TypeScript를 컴파일하면 일반적인 JavaScript 코드로 변환됩니다.

export namespace Geometry {
    export namespace Circle {
        const PI = 3.14;

        export function calculateArea(radius: number): number {
            return PI * radius * radius;
        }

        export function calculateCircumference(radius: number): number {
            return 2 * PI * radius;
        }
    }

    export namespace Rectangle {
        export function calculateArea(width: number, height: number): number {
            return width * height;
        }

        export function calculatePerimeter(width: number, height: number): number {
            return 2 * (width + height);
        }
    }
}
