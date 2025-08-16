class PermeatedEffect extends BaseStatusEffect {
    constructor() {
        super(Number.MAX_SAFE_INTEGER, STATUS_EFFECT_SOURCES.PATHOGEN);
    }

    get_type() {
        return 'PERMEATED';
    }

    apply_effect(target) {
        
    }

    remove_effect(target) {
        
    }

    is_immune_to_projectiles() {
        return true;
    }
}

window.PermeatedEffect = PermeatedEffect;