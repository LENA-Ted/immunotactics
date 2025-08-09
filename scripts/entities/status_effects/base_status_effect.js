const STATUS_EFFECT_SOURCES = {
    IMMUNE_CELL: 'IMMUNE_CELL',
    PATHOGEN: 'PATHOGEN',
    OTHER: 'OTHER'
};

class BaseStatusEffect {
    constructor(duration_ms, source_category = STATUS_EFFECT_SOURCES.OTHER) {
        this.base_duration_ms = duration_ms;
        this.source_category = source_category;
        this.duration_ms = this.apply_duration_modifier(duration_ms);
        this.remaining_time_ms = this.duration_ms;
        this.start_time = performance.now();
    }

    apply_duration_modifier(base_duration) {
        if (window.game_state && window.game_state.adaptation_system) {
            const multiplier = window.game_state.adaptation_system.get_status_effect_duration_multiplier(this.source_category);
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

    get_source_category() {
        return this.source_category;
    }

    is_from_immune_cell() {
        return this.source_category === STATUS_EFFECT_SOURCES.IMMUNE_CELL;
    }

    is_from_pathogen() {
        return this.source_category === STATUS_EFFECT_SOURCES.PATHOGEN;
    }

    apply_effect(target) {
        
    }

    remove_effect(target) {
        
    }
}

window.BaseStatusEffect = BaseStatusEffect;
window.STATUS_EFFECT_SOURCES = STATUS_EFFECT_SOURCES;