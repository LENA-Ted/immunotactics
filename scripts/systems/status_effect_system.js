class StatusEffectSystem {
    constructor() {
        
    }

    update_all_status_effects(entities, timestamp) {
        entities.forEach(entity => {
            if (entity.update_status_effects) {
                entity.update_status_effects(timestamp);
            }
        });
    }

    apply_interfered(target, duration_ms) {
        const interfered_effect = new InterferedEffect(duration_ms);
        target.add_status_effect(interfered_effect);
    }

    apply_suppressed(target, duration_ms) {
        const suppressed_effect = new SuppressedEffect(duration_ms);
        target.add_status_effect(suppressed_effect);
    }

    remove_all_status_effects(target) {
        if (target.status_effects) {
            target.status_effects.forEach(effect => {
                effect.remove_effect(target);
            });
            target.status_effects = [];
        }
    }

    get_status_effects_of_type(target, effect_type) {
        if (!target.status_effects) {
            return [];
        }
        
        return target.status_effects.filter(effect => effect.get_type() === effect_type);
    }

    is_target_suppressed(target) {
        return target.is_suppressed === true || target.has_status_effect('SUPPRESSED');
    }

    clear_suppressed_status(target) {
        if (target.is_suppressed !== undefined) {
            target.is_suppressed = false;
        }
        
        const suppressed_effects = this.get_status_effects_of_type(target, 'SUPPRESSED');
        suppressed_effects.forEach(effect => {
            effect.remove_effect(target);
        });
        
        if (target.status_effects) {
            target.status_effects = target.status_effects.filter(effect => effect.get_type() !== 'SUPPRESSED');
        }
    }
}

window.StatusEffectSystem = StatusEffectSystem;