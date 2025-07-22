class PerforinPulse extends BasePhenotype {
    constructor() {
        super(PHENOTYPE_TYPES.PERFORIN_PULSE);
    }

    execute_action(cursor_x, cursor_y, core_x, core_y) {
        this.create_projectile(cursor_x, cursor_y, core_x, core_y);
    }

    create_projectile(cursor_x, cursor_y, core_x, core_y) {
        if (!window.game_state || !window.game_state.projectiles) {
            return;
        }

        const fake_target = {
            x: cursor_x,
            y: cursor_y
        };

        const projectile = new PhenotypeProjectile(core_x, core_y, fake_target, this);
        projectile.damage = this.calculate_damage();
        projectile.speed = this.config.projectile_speed;
        projectile.radius = this.config.projectile_radius;
        
        window.game_state.projectiles.push(projectile);
    }

    calculate_damage() {
        const base_damage = this.config.base_damage;
        const level_bonus = this.get_phenotype_level() * this.config.damage_per_level;
        const cytokine_bonus = this.get_cytokine_damage_bonus();
        
        return base_damage + level_bonus + cytokine_bonus;
    }

    get_phenotype_level() {
        if (window.game_state && window.game_state.phenotype_system) {
            return window.game_state.phenotype_system.get_phenotype_level();
        }
        return 0;
    }

    get_cytokine_damage_bonus() {
        if (!window.game_state || !window.game_state.resource_system) {
            return 0;
        }
        
        const cytokines = window.game_state.resource_system.get_cytokines();
        const bonus_percentage = cytokines * this.config.cytokine_damage_factor;
        const base_damage = this.config.base_damage;
        const level_bonus = this.get_phenotype_level() * this.config.damage_per_level;
        
        return Math.ceil((base_damage + level_bonus) * bonus_percentage);
    }
}

window.PerforinPulse = PerforinPulse;