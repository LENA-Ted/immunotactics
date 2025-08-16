class Adenovirus extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.ADENOVIRUS, ENEMY_CATEGORIES.PATHOGEN, PATHOGEN_TYPES.ADENOVIRUS);
        this.permeation_aura = new AdenovirusPermeationAura(this.x, this.y, this.config.aura_radius);
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
        this.update_aura();
    }

    update_aura() {
        this.permeation_aura.update_position(this.x, this.y);
        
        if (window.game_state && window.game_state.enemies) {
            this.permeation_aura.update(window.game_state.enemies, this);
        }
    }

    draw(ctx) {
        this.update_pulsate();
        this.permeation_aura.draw(ctx);
        this.draw_body(ctx);
        this.draw_hp_gauge(ctx);
    }

    get_permeation_aura() {
        return this.permeation_aura;
    }
}

window.Adenovirus = Adenovirus;