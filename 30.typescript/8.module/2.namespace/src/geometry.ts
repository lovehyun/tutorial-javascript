// src/geometry.ts

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
