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

window.MathUtils = {
    lerp,
    get_distance,
    get_angle_between,
    get_random_int,
    get_random_float,
    clamp
};