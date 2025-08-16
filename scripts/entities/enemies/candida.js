class Candida extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.CANDIDA, ENEMY_CATEGORIES.PATHOGEN, PATHOGEN_TYPES.CANDIDA);
        this.healing_aura = new CandidaHealingAura(this.x, this.y, this.config.aura_radius);
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
        this.update_aura_position();
    }

    update_aura_position() {
        this.healing_aura.update_position(this.x, this.y);
    }

    draw(ctx) {
        this.update_pulsate();
        this.healing_aura.draw(ctx);
        this.draw_body(ctx);
        this.draw_hp_gauge(ctx);
    }

    get_healing_aura() {
        return this.healing_aura;
    }
}

window.Candida = Candida;