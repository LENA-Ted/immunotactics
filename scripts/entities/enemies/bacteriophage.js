class Bacteriophage extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.BACTERIOPHAGE);
        this.pathogen_type = PATHOGEN_TYPES.BACTERIOPHAGE;
        this.pathogen_class = PATHOGEN_CLASSES.VIRUS;
        this.suppression_radius = this.radius * this.config.suppression_radius_multiplier;
        this.suppression_opacity = 0;
        this.suppression_flicker_frequency = 0.5;
        this.spawn_time = performance.now();
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.update_suppression_visual();
        this.apply_suppression_to_immune_cells();
        this.move_toward_target(target);
    }

    update_suppression_visual() {
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            const elapsed = performance.now() - this.spawn_time;
            const flicker_time = elapsed / 1000.0;
            this.suppression_opacity = 0.3 + Math.sin(flicker_time * this.suppression_flicker_frequency * Math.PI * 2) * 0.2;
            return;
        }

        const elapsed = window.game_state.get_adjusted_elapsed_time(this.spawn_time);
        const flicker_time = elapsed / 1000.0;
        this.suppression_opacity = 0.3 + Math.sin(flicker_time * this.suppression_flicker_frequency * Math.PI * 2) * 0.2;
        this.suppression_opacity = MathUtils.clamp(this.suppression_opacity, 0.1, 0.5);
    }

    apply_suppression_to_immune_cells() {
        if (!window.game_state || !window.game_state.towers) {
            return;
        }

        window.game_state.towers.forEach(tower => {
            const distance = MathUtils.get_distance(this.x, this.y, tower.x, tower.y);
            
            if (distance <= this.suppression_radius) {
                if (!tower.has_status_effect || !tower.has_status_effect('SUPPRESSED')) {
                    const suppressed_effect = new SuppressedEffect(200);
                    if (tower.add_status_effect) {
                        tower.add_status_effect(suppressed_effect);
                    }
                }
            }
        });
    }

    draw(ctx) {
        this.draw_suppression_aura(ctx);
        this.update_pulsate();
        this.draw_body(ctx);
        this.draw_hp_gauge(ctx);
    }

    draw_suppression_aura(ctx) {
        if (this.suppression_opacity <= 0) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = this.suppression_opacity;
        ctx.strokeStyle = '#8A2BE2';
        ctx.fillStyle = '#8A2BE2';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.suppression_radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    get_suppression_radius() {
        return this.suppression_radius;
    }

    get_pathogen_type() {
        return this.pathogen_type;
    }

    get_pathogen_class() {
        return this.pathogen_class;
    }
}

window.Bacteriophage = Bacteriophage;