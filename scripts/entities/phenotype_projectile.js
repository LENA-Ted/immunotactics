class PhenotypeProjectile {
    constructor(x, y, target_x, target_y, damage, phenotype_config) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.radius = phenotype_config.projectile_radius;
        this.speed = phenotype_config.projectile_speed;
        this.is_phenotype_projectile = true;
        
        const angle = MathUtils.get_angle_between(x, y, target_x, target_y);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = '#FFE135';
        ctx.strokeStyle = '#FFF176';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
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

    get_damage() {
        return this.damage;
    }
}

window.PhenotypeProjectile = PhenotypeProjectile;