import { Circle } from "./Circle";
import { Rect } from "./Rect";
import { Vec2D, Shape } from "./Base";


export function checkCollision(A: Shape, B: Shape): boolean {
    if (A instanceof Circle && B instanceof Circle) {
        return (A.center.x - B.center.x) ** 2 + (A.center.y - B.center.y) ** 2 < (A.r + B.r) ** 2;
    }
}

export function getCollisionPosition(A: Shape, B: Shape, A_target: Vec2D): Vec2D|null {
    if (A instanceof Circle && B instanceof Circle) {

        const travel_distance = A.center.distanceTo(A_target);
        
        return A_target;
        return null;
    }
}

export function angular_collision(A: Vec2D, Av: Vec2D, B: Vec2D): Vec2D {
    const speed = (Av.x ** 2 + Av.y ** 2) ** 0.5;
    const collision_angle = Math.atan2(A.y - B.y, A.x - B.x);
    const tangent = collision_angle + Math.PI / 2;
    const vel_angle = Math.atan2(Av.y, Av.x);
    const new_angle = get_reflected_angle(vel_angle, tangent);
    return new Vec2D(speed * Math.cos(new_angle), speed * Math.sin(new_angle));
}

export function get_reflected_angle(in_angle: number, symmetry_angle: number): number {
    const dist = symmetry_angle - in_angle;
    return mod(symmetry_angle + dist, 2 * Math.PI);
}

export function mod(n: number, k: number): number {
    while (n < 0) {
        n += k;
    }
    return n % k;
}