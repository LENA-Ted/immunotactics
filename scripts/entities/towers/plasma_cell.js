class PlasmaCell extends BaseTower {
    constructor(x, y, id) {
        super(x, y, id, IMMUNE_CELL_CONFIGS.PLASMA_CELL);
        this.apply_adjuvant_hp_bonus();
    }

    apply_adjuvant_hp_bonus() {
        if (window.game_state && window.game_state.resource_system) {
            const hp_multiplier = window.game_state.resource_system.get_adjuvant_hp_multiplier();
            this.hp = Math.ceil(this.config.base_hp * hp_multiplier);
            this.max_hp = this.hp;
        }
    }

    check_activity_criteria() {
        if (!window.game_state || !window.game_state.enemies) {
            return false;
        }

        return window.game_state.enemies.some(enemy => this.is_in_range(enemy));
    }

    perform_action(timestamp) {
        if (!this.has_targets()) {
            return;
        }

        if (!this.can_afford_action()) {
            return;
        }

        this.consume_action_cost();
        this.shoot_omnidirectional();
    }

    has_targets() {
        return this.check_activity_criteria();
    }

    shoot_omnidirectional() {
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('SHOOT_PROJECTILE');
        }
        
        this.create_omnidirectional_projectiles();
    }

    create_omnidirectional_projectiles() {
        if (!window.game_state || !window.game_state.projectiles) {
            return;
        }

        const directions = [
            0,                    
            Math.PI / 4,          
            Math.PI / 2,          
            3 * Math.PI / 4,      
            Math.PI,              
            5 * Math.PI / 4,      
            3 * Math.PI / 2,      
            7 * Math.PI / 4       
        ];

        directions.forEach(angle => {
            const projectile = this.create_angled_projectile(angle);
            if (projectile) {
                window.game_state.projectiles.push(projectile);
            }
        });
    }

    create_angled_projectile(angle) {
        const fake_target = {
            x: this.x + Math.cos(angle) * 100,
            y: this.y + Math.sin(angle) * 100
        };

        const projectile = new Projectile(this.x, this.y, fake_target, this);
        projectile.damage = this.config.projectile_damage;
        
        return projectile;
    }
}

window.PlasmaCell = PlasmaCell;