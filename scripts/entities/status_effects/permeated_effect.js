class PermeatedEffect extends BaseStatusEffect {
    constructor() {
        super(Number.MAX_SAFE_INTEGER, STATUS_EFFECT_SOURCES.PATHOGEN);
    }

    get_type() {
        return 'PERMEATED';
    }

    apply_effect(target) {
        if (!target || !target.apply_permeated_visuals) {
            return;
        }
        
        target.apply_permeated_visuals();
    }

    remove_effect(target) {
        if (!target || !target.restore_original_visuals) {
            return;
        }
        
        target.restore_original_visuals();
    }

    is_immune_to_projectiles() {
        return true;
    }
}

window.PermeatedEffect = PermeatedEffect;