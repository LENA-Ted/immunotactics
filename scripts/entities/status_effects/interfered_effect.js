class InterferedEffect extends BaseStatusEffect {
    constructor(duration_ms) {
        super(duration_ms);
        this.speed_reduction_factor = 0.5;
    }

    get_type() {
        return 'INTERFERED';
    }

    apply_effect(target) {
        
    }

    remove_effect(target) {
        
    }

    get_speed_multiplier() {
        return this.speed_reduction_factor;
    }
}

window.InterferedEffect = InterferedEffect;