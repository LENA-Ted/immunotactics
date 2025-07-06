class BaseStatusEffect {
    constructor(duration_ms) {
        this.duration_ms = duration_ms;
        this.remaining_time_ms = duration_ms;
        this.start_time = performance.now();
    }

    update(timestamp) {
        const elapsed = timestamp - this.start_time;
        this.remaining_time_ms = Math.max(0, this.duration_ms - elapsed);
    }

    is_expired() {
        return this.remaining_time_ms <= 0;
    }

    get_remaining_time() {
        return this.remaining_time_ms;
    }

    get_type() {
        return 'BASE';
    }

    apply_effect(target) {
        
    }

    remove_effect(target) {
        
    }
}

window.BaseStatusEffect = BaseStatusEffect;