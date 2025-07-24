function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function get_distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function get_angle_between(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_float(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function cubic_bezier_ease_out(t) {
    const p1 = GAME_CONFIG.CUBIC_BEZIER_EASE_OUT_P1;
    const p2 = GAME_CONFIG.CUBIC_BEZIER_EASE_OUT_P2;
    const p3 = GAME_CONFIG.CUBIC_BEZIER_EASE_OUT_P3;
    const p4 = GAME_CONFIG.CUBIC_BEZIER_EASE_OUT_P4;
    
    const x = t;
    const cx = 3.0 * p1;
    const bx = 3.0 * (p3 - p1) - cx;
    const ax = 1.0 - cx - bx;
    
    const cy = 3.0 * p2;
    const by = 3.0 * (p4 - p2) - cy;
    const ay = 1.0 - cy - by;
    
    return ((ay * x + by) * x + cy) * x;
}

function dynamic_ease_lerp(current, target, base_speed, distance_multiplier) {
    const distance = Math.abs(target - current);
    const dynamic_speed = base_speed + (distance * distance_multiplier);
    const clamped_speed = Math.min(dynamic_speed, 1.0);
    
    const linear_progress = clamped_speed;
    const eased_progress = cubic_bezier_ease_out(linear_progress);
    
    return lerp(current, target, eased_progress);
}

window.MathUtils = {
    lerp,
    get_distance,
    get_angle_between,
    get_random_int,
    get_random_float,
    clamp,
    cubic_bezier_ease_out,
    dynamic_ease_lerp
};