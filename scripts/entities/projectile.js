class Projectile {
    constructor(x, y, target, source_tower = null) {
        this.x = x;
        this.y = y;
        this.start_x = x;
        this.start_y = y;
        this.radius = 4;
        this.damage = GAME_CONFIG.PROJECTILE_DAMAGE;
        this.source_tower = source_tower;
        this.max_range = source_tower ? source_tower.get_range() : null;
        
        const angle = MathUtils.get_angle_between(x, y, target.x, target.y);
        this.vx = Math.cos(angle) * GAME_CONFIG.PROJECTILE_SPEED;
        this.vy = Math.sin(angle) * GAME_CONFIG.PROJECTILE_SPEED;
    }

    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    is_out_of_bounds(canvas_width, canvas_height) {
        const margin = 10;
        return this.x < -margin || 
               this.x > canvas_width + margin || 
               this.y < -margin || 
               this.y > canvas_height + margin;
    }

    is_out_of_range() {
        if (this.max_range === null) {
            return false;
        }
        
        const distance = MathUtils.get_distance(this.start_x, this.start_y, this.x, this.y);
        return distance > this.max_range;
    }

    get_damage() {
        let final_damage = this.damage;
        
        final_damage = this.apply_adaptation_damage_multiplier(final_damage);
        final_damage = this.apply_resource_damage_multiplier(final_damage);
        
        return final_damage;
    }

    apply_adaptation_damage_multiplier(base_damage) {
        const multiplier = this.get_adaptation_damage_multiplier();
        return Math.ceil(base_damage * multiplier);
    }

    apply_resource_damage_multiplier(base_damage) {
        if (window.game_state && window.game_state.resource_system) {
            return window.game_state.resource_system.apply_damage_bonus(base_damage);
        }
        return base_damage;
    }

    get_adaptation_damage_multiplier() {
        if (window.game_state && window.game_state.adaptation_system) {
            return window.game_state.adaptation_system.get_total_damage_multiplier();
        }
        return 1.0;
    }
}

window.Projectile = Projectile;