class PerforinPulse extends BasePhenotype {
    constructor() {
        super(PHENOTYPE_TYPES.PERFORIN_PULSE);
    }

    perform_action(cursor_x, cursor_y, phenotype_level) {
        if (!window.game_state || !window.game_state.core) {
            return;
        }

        const core = window.game_state.core;
        const damage = this.calculate_total_damage(phenotype_level);
        
        this.create_projectile(core.x, core.y, cursor_x, cursor_y, damage);
    }

    create_projectile(start_x, start_y, target_x, target_y, damage) {
        if (!window.game_state || !window.game_state.projectiles) {
            return;
        }

        const projectile = new PhenotypeProjectile(
            start_x, 
            start_y, 
            target_x, 
            target_y, 
            damage, 
            this.config
        );

        window.game_state.projectiles.push(projectile);
    }
}

window.PerforinPulse = PerforinPulse;