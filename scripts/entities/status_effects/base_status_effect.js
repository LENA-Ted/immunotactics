class BaseStatusEffect {
    constructor(duration_ms) {
        this.base_duration_ms = duration_ms;
        this.duration_ms = this.apply_duration_modifier(duration_ms);
        this.remaining_time_ms = this.duration_ms;
        this.start_time = performance.now();
    }

    apply_duration_modifier(base_duration) {
        if (window.game_state && window.game_state.adaptation_system) {
            const multiplier = window.game_state.adaptation_system.get_status_effect_duration_multiplier();
            return Math.ceil(base_duration * multiplier);
        }
        return base_duration;
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