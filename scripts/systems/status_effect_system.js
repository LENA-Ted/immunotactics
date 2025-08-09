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

    apply_interfered(target, duration_ms, source_category = STATUS_EFFECT_SOURCES.IMMUNE_CELL) {
        const interfered_effect = new InterferedEffect(duration_ms, source_category);
        return target.add_status_effect(interfered_effect);
    }

    apply_inoculated(target) {
        const inoculated_effect = new InoculatedEffect();
        return target.add_status_effect(inoculated_effect);
    }

    remove_all_status_effects(target) {
        if (target.status_effects) {
            target.status_effects.forEach(effect => {
                effect.remove_effect(target);
            });
            target.status_effects = [];
        }
    }

    remove_immune_cell_status_effects(target) {
        if (!target.status_effects) {
            return;
        }

        const effects_to_remove = target.status_effects.filter(effect => 
            effect.is_from_immune_cell()
        );

        effects_to_remove.forEach(effect => {
            effect.remove_effect(target);
            const effect_index = target.status_effects.indexOf(effect);
            if (effect_index !== -1) {
                target.status_effects.splice(effect_index, 1);
            }
        });
    }

    get_status_effects_of_type(target, effect_type) {
        if (!target.status_effects) {
            return [];
        }
        
        return target.status_effects.filter(effect => effect.get_type() === effect_type);
    }

    get_status_effects_from_source(target, source_category) {
        if (!target.status_effects) {
            return [];
        }
        
        return target.status_effects.filter(effect => effect.get_source_category() === source_category);
    }
}

window.StatusEffectSystem = StatusEffectSystem;