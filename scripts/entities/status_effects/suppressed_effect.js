class SuppressedEffect extends BaseStatusEffect {
    constructor(duration_ms) {
        super(duration_ms);
    }

    get_type() {
        return 'SUPPRESSED';
    }

    apply_effect(target) {
        if (target.is_suppressed !== undefined) {
            target.is_suppressed = true;
        }
    }

    remove_effect(target) {
        if (target.is_suppressed !== undefined) {
            target.is_suppressed = false;
        }
    }
}

window.SuppressedEffect = SuppressedEffect;