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
}

window.StatusEffectSystem = StatusEffectSystem;