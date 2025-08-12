class ParalyzedEffect extends BaseStatusEffect {
    constructor(duration_ms, source_category = STATUS_EFFECT_SOURCES.IMMUNE_CELL) {
        super(duration_ms, source_category);
    }

    get_type() {
        return 'PARALYZED';
    }

    apply_effect(target) {
        
    }

    remove_effect(target) {
        
    }
}

window.ParalyzedEffect = ParalyzedEffect;