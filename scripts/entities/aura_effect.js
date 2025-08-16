class BaseAura {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.opacity = 0.3;
        this.max_opacity = 0.3;
        this.min_opacity = 0.1;
        this.pulse_speed = 0.02;
        this.pulse_direction = 1;
        this.entities_in_aura = new Set();
    }

    update_position(x, y) {
        this.x = x;
        this.y = y;
    }

    update_pulse_animation() {
        this.opacity += this.pulse_speed * this.pulse_direction;
        
        if (this.opacity >= this.max_opacity) {
            this.opacity = this.max_opacity;
            this.pulse_direction = -1;
        } else if (this.opacity <= this.min_opacity) {
            this.opacity = this.min_opacity;
            this.pulse_direction = 1;
        }
    }

    is_entity_in_aura(entity) {
        const distance = MathUtils.get_distance(this.x, this.y, entity.x, entity.y);
        return distance <= this.radius;
    }

    get_entities_in_range(all_entities) {
        return all_entities.filter(entity => this.is_entity_in_aura(entity));
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

class CandidaHealingAura extends BaseAura {
    constructor(x, y, radius) {
        super(x, y, radius, '#50C878');
        this.last_heal_time = 0;
        this.heal_interval_ms = 500;
        this.heal_percentage = 0.01;
    }

    update(timestamp, all_enemies, owner_entity) {
        this.update_pulse_animation();
        this.attempt_heal_entities(timestamp, all_enemies, owner_entity);
    }

    attempt_heal_entities(timestamp, all_enemies, owner_entity) {
        const adjusted_elapsed = this.get_adjusted_elapsed_time_since_last_heal(timestamp);
        
        if (adjusted_elapsed >= this.heal_interval_ms) {
            this.heal_entities_in_aura(all_enemies, owner_entity);
            this.last_heal_time = this.get_current_adjusted_time(timestamp);
        }
    }

    get_current_adjusted_time(timestamp) {
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            return window.game_state.get_adjusted_elapsed_time(0);
        }
        return timestamp;
    }

    get_adjusted_elapsed_time_since_last_heal(timestamp) {
        if (!this.last_heal_time) {
            this.last_heal_time = this.get_current_adjusted_time(timestamp);
            return 0;
        }
        
        const current_adjusted_time = this.get_current_adjusted_time(timestamp);
        return current_adjusted_time - this.last_heal_time;
    }

    heal_entities_in_aura(all_enemies, owner_entity) {
        const entities_in_range = this.get_entities_in_range(all_enemies);
        
        entities_in_range.forEach(entity => {
            if (entity !== owner_entity && entity.is_alive()) {
                const heal_amount = Math.ceil(entity.max_hp * this.heal_percentage);
                entity.hp = Math.min(entity.max_hp, entity.hp + heal_amount);
            }
        });
    }
}

class AdenovirusPermeationAura extends BaseAura {
    constructor(x, y, radius) {
        super(x, y, radius, '#9370DB');
    }

    update(all_enemies, owner_entity) {
        this.update_pulse_animation();
        this.manage_permeated_status(all_enemies, owner_entity);
    }

    manage_permeated_status(all_enemies, owner_entity) {
        const entities_in_range = this.get_entities_in_range(all_enemies);
        const microbes_in_range = entities_in_range.filter(entity => 
            entity !== owner_entity && entity.is_microbe && entity.is_microbe()
        );
        
        const current_entities_in_aura = new Set(microbes_in_range);
        
        this.apply_permeated_to_entering_entities(current_entities_in_aura);
        this.remove_permeated_from_leaving_entities(current_entities_in_aura);
        
        this.entities_in_aura = current_entities_in_aura;
    }

    apply_permeated_to_entering_entities(current_entities_in_aura) {
        current_entities_in_aura.forEach(entity => {
            if (!this.entities_in_aura.has(entity)) {
                const permeated_effect = new PermeatedEffect();
                entity.add_status_effect(permeated_effect);
            }
        });
    }

    remove_permeated_from_leaving_entities(current_entities_in_aura) {
        this.entities_in_aura.forEach(entity => {
            if (!current_entities_in_aura.has(entity) && entity.status_effects) {
                const permeated_effects = entity.status_effects.filter(effect => 
                    effect.get_type() === 'PERMEATED'
                );
                
                permeated_effects.forEach(effect => {
                    effect.remove_effect(entity);
                    const effect_index = entity.status_effects.indexOf(effect);
                    if (effect_index !== -1) {
                        entity.status_effects.splice(effect_index, 1);
                    }
                });
            }
        });
    }
}

window.BaseAura = BaseAura;
window.CandidaHealingAura = CandidaHealingAura;
window.AdenovirusPermeationAura = AdenovirusPermeationAura;